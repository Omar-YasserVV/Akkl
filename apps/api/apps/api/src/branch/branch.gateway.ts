import {
  CreateOrderDto,
  UpdateBranchMenuItemDto,
  UpdateOrderDto
} from '@app/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ReservationStatus, TableStatus, } from 'libs/db/generated/client/client';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class BranchGateway {
  @WebSocketServer()
  server!: Server;

  // Replaced 'branch.created'
  @EventPattern('branch.draft_created')
  handleBranchDraftCreated(@Payload() data: any) {
    console.log('Pushing new draft branch to UI:', data?.branchNumber);
    this.server.emit('new_branch_draft_added', data);
  }

  // New Event for when Step 4 is finished
  @EventPattern('branch.activated')
  handleBranchActivated(@Payload() data: any) {
    console.log('Pushing activated branch to UI:', data?.name);
    this.server.emit('branch_activated', data);
  }

  @EventPattern('branch.updated')
  handleBranchUpdated(@Payload() data: any) { // Using 'any' loosely here to avoid the DTO naming crash
    console.log('Pushing updated branch to UI:', data?.name || data?.branchNumber);
    this.server.emit('branch_updated', data);
  }

  @EventPattern('branch.deleted')
  handleBranchDeleted(@Payload() payload: { id: string, restaurantId: string }) {
    console.log('Pushing deleted branch ID to UI:', payload.id);
    this.server.emit('branch_deleted', { id: payload.id });
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
  // ---------------- TABLES / FLOOR PLAN EVENTS ----------------
  
  @EventPattern('table.created')
  handleTableCreated(@Payload() data: any) {
    console.log(`Pushing new physical table [${data?.tableNumber}] configuration map to UI`);
    // Scope events to specific branch channels so other branches don't receive unrelated floor mutations
    this.server.emit(`branch.${data.branchId}.table_created`, data);
  }

  @EventPattern('table.status_updated')
  handleTableStatusUpdated(
    @Payload() payload: { tableId: string; branchId: string; status: TableStatus },
  ) {
    console.log(`Pushing real-time floor status shift for table ${payload.tableId} to ${payload.status}`);
    this.server.emit(`branch.${payload.branchId}.table_status_updated`, {
      tableId: payload.tableId,
      status: payload.status,
    });
  }

  @EventPattern('table.deleted')
  handleTableDeleted(@Payload() payload: { tableId: string; branchId: string }) {
    console.log(`Pushing floor deletion signal for table ${payload.tableId}`);
    this.server.emit(`branch.${payload.branchId}.table_deleted`, {
      tableId: payload.tableId,
    });
  }

  // ---------------- RESERVATIONS EVENTS ----------------

  @EventPattern('reservation.created')
  handleReservationCreated(@Payload() data: any) {
    console.log(`Pushing new secured reservation slot to branch lineup dashboard`);
    this.server.emit(`branch.${data.branchId}.reservation_created`, data);
  }

  @EventPattern('reservation.cancelled')
  handleReservationCancelled(
    @Payload() payload: { reservationId: string; branchId: string },
  ) {
    console.log(`Pushing cancellation drop signal for reservation entry ${payload.reservationId}`);
    this.server.emit(`branch.${payload.branchId}.reservation_cancelled`, {
      reservationId: payload.reservationId,
      status: ReservationStatus.CANCELLED,
    });
  }
}