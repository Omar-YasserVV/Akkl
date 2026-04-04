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
  // Menu item endpoints
  @EventPattern('menu_item.updated')
  handleMenuItemUpdated(@Payload() data: any) {
    console.log('Pushing updated menu item to UI:', data.name);
    this.server.emit('menu_item_updated', data);
  }

  @EventPattern('menu_item.deleted')
  handleMenuItemDeleted(@Payload() data: any) {
    console.log('Pushing deleted menu item ID to UI:', data.id);
    this.server.emit('menu_item_deleted', data);
  }
  // Order endpoints
  @EventPattern('order.created')
  handleOrderCreated(@Payload() data: any) {
    console.log('Pushing new order to UI:', data.id);
    this.server.emit('new_order_added', data);
  }

  @EventPattern('order.updated')
  handleOrderUpdated(@Payload() data: any) {
    console.log('Pushing updated order to UI:', data.id);
    this.server.emit('order_updated', data);
  }

  @EventPattern('order.deleted')
  handleOrderDeleted(@Payload() data: any) {
    console.log('Pushing deleted order ID to UI:', data.id);
    this.server.emit('order_deleted', data);
  }
}
