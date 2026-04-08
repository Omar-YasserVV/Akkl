import {
  CreateBranchDto,
  CreateOrderDto,
  UpdateBranchDto,
  UpdateBranchMenuItemDto,
  UpdateOrderDto,
} from '@app/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class BranchGateway {
  @WebSocketServer()
  server!: Server;

  @EventPattern('branch.created')
  handleBranchCreated(@Payload() data: CreateBranchDto) {
    console.log('Pushing new branch to UI:', data.name);
    this.server.emit('new_branch_added', data);
  }

  @EventPattern('branch.updated')
  handleBranchUpdated(@Payload() data: UpdateBranchDto) {
    console.log('Pushing updated branch to UI:', data.name);
    this.server.emit('branch_updated', data);
  }

  @EventPattern('branch.deleted')
  handleBranchDeleted(@Payload() branchId: number) {
    console.log('Pushing deleted branch ID to UI:', branchId);
    this.server.emit('branch_deleted', { id: branchId });
  }
  // Menu item endpoints
  @EventPattern('menu_item.updated')
  handleMenuItemUpdated(@Payload() data: UpdateBranchMenuItemDto) {
    console.log('Pushing updated menu item to UI:', data.name);
    this.server.emit('menu_item_updated', data);
  }

  @EventPattern('menu_item.deleted')
  handleMenuItemDeleted(@Payload() menuItemId: number) {
    console.log('Pushing deleted menu item ID to UI:', menuItemId);
    this.server.emit('menu_item_deleted', { id: menuItemId });
  }
  // Order endpoints
  @EventPattern('order.created')
  handleOrderCreated(@Payload() data: CreateOrderDto) {
    console.log('Pushing new order to UI:', data);
    this.server.emit('new_order_added', data);
  }

  @EventPattern('order.updated')
  handleOrderUpdated(@Payload() data: UpdateOrderDto) {
    console.log('Pushing updated order to UI:', data);
    this.server.emit('order_updated', data);
  }

  @EventPattern('order.deleted')
  handleOrderDeleted(@Payload() orderId: number) {
    console.log('Pushing deleted order ID to UI:', orderId);
    this.server.emit('order_deleted', { id: orderId });
  }
}
