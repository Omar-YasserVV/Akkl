import type { INestApplication } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

interface OrpcProcedureBuilder {
  handler<TInput = unknown, TOutput = unknown>(
    handler: (options: { input: TInput }) => TOutput,
  ): unknown;
}

interface OrpcRootBuilder {
  route(options: {
    method: 'GET' | 'POST';
    path: string;
  }): OrpcProcedureBuilder;
}

interface OrpcServerModule {
  os: OrpcRootBuilder;
  onError: (callback: (error: unknown) => void) => unknown;
}

interface OrpcHandler {
  handle(
    req: Request,
    res: Response,
    options: { prefix: string; context: Record<string, never> },
  ): Promise<{ matched: boolean }>;
}

interface OrpcNodeModule {
  RPCHandler: new (
    router: unknown,
    options: { interceptors: unknown[] },
  ) => OrpcHandler;
}

// eslint-disable-next-line @typescript-eslint/no-implied-eval
const importOrpcServer = new Function(
  "return import('@orpc/server')",
) as () => Promise<OrpcServerModule>;
// eslint-disable-next-line @typescript-eslint/no-implied-eval
const importOrpcNode = new Function(
  "return import('@orpc/server/node')",
) as () => Promise<OrpcNodeModule>;

export async function setupOrpc(app: INestApplication): Promise<void> {
  const [{ os, onError }, { RPCHandler }] = await Promise.all([
    importOrpcServer(),
    importOrpcNode(),
  ]);

  const health = os
    .route({
      method: 'GET',
      path: '/health',
    })
    .handler(() => ({
      status: 'ok',
      service: 'api-gateway',
      timestamp: new Date().toISOString(),
    }));

  const echo = os
    .route({
      method: 'POST',
      path: '/echo',
    })
    .handler<{ message?: string }>(({ input }) => ({
      message: input?.message ?? '',
    }));

  const orpcRouter = {
    system: { health, echo },
  };

  const orpcHandler = new RPCHandler(orpcRouter, {
    interceptors: [
      onError((error) => {
        console.error('oRPC error:', error);
      }),
    ],
  });

  app.use(
    '/orpc{/*path}',
    async (req: Request, res: Response, next: NextFunction) => {
      const result = await orpcHandler.handle(req, res, {
        prefix: '/orpc',
        context: {},
      });

      if (result.matched) {
        return;
      }

      next();
    },
  );
}
