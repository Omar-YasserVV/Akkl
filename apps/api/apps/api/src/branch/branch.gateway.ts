import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { EventPattern, Payload } from '@nestjs/microservices';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class BranchGateway {
  @WebSocketServer()
  server: Server;

  @EventPattern('branch.created')
  handleBranchCreated(@Payload() data: any) {
    console.log('Pushing new branch to UI:', data.name);
    this.server.emit('new_branch_added', data);
  }

  @EventPattern('branch.updated')
  handleBranchUpdated(@Payload() data: any) {
    console.log('Pushing updated branch to UI:', data.name);
    this.server.emit('branch_updated', data);
  }

  @EventPattern('branch.deleted')
  handleBranchDeleted(@Payload() data: any) {
    console.log('Pushing deleted branch ID to UI:', data.id);
    this.server.emit('branch_deleted', data);
  }
}
