import React from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Order, OrderStatus } from "../types/PaginatedResponse";

interface OrdersListProps {
  orders: Order[];
  onRefresh?: () => void;
  refreshing?: boolean;
}

// Sophisticated, modern color palette for status indicators
const getStatusStyles = (status: OrderStatus) => {
  switch (status) {
    case "COMPLETED":
      return { bg: "#E6F4EA", text: "#137333" };
    case "IN_PROGRESS":
      return { bg: "#E8F0FE", text: "#1A73E8" };
    case "PENDING":
      return { bg: "#FEF7E0", text: "#B06000" };
    default:
      return { bg: "#F1F3F4", text: "#5F6368" };
  }
};

const OrderCard = ({ order }: { order: Order }) => {
  const statusStyle = getStatusStyles(order.status);

  // Extracting first item image if available
  const itemImage = order.items?.[0]?.branchMenuItem?.image;

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={styles.card}>
      {/* Left: Product Thumbnail */}
      <View style={styles.imageContainer}>
        {itemImage ? (
          <Image
            source={{ uri: itemImage }}
            style={styles.productImage}
            resizeMode="cover"
          />
        ) : (
          /* Sleek fallback minimal placeholder box if items are empty */
          <View style={styles.placeholderBox}>
            <Text style={styles.placeholderText}>🛍️</Text>
          </View>
        )}
        <View style={styles.sourceBadge}>
          <Text style={styles.sourceText}>{order.source}</Text>
        </View>
      </View>

      {/* Right: Order Core Content */}
      <View style={styles.infoContainer}>
        {/* Header Row: ID & Status Badge */}
        <View style={styles.cardHeader}>
          <Text style={styles.orderNumber}>ID #{order.orderNumber}</Text>
          <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.badgeText, { color: statusStyle.text }]}>
              {order.status.replace("_", " ")}
            </Text>
          </View>
        </View>

        {/* Customer & Branch details */}
        <Text style={styles.customerName} numberOfLines={1}>
          {order.customerName}
        </Text>
        <Text style={styles.branchText} numberOfLines={1}>
          {order.branch.name}
        </Text>

        {/* Footer Details Wrapper */}
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.dateText}>{formattedDate}</Text>
            <Text style={styles.itemsCount}>
              {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
            </Text>
          </View>
          <Text style={styles.price}>
            ${parseFloat(order.totalPrice).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export const OrdersList = ({
  orders,
  onRefresh,
  refreshing = false,
}: OrdersListProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OrderCard order={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#EAECEF",
    shadowColor: "#0A101D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  imageContainer: {
    position: "relative",
    marginRight: 12,
  },
  productImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: "#F0F2F5",
  },
  placeholderBox: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: "#F0F2F5",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 28,
  },
  sourceBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#0057C0",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  sourceText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  orderNumber: {
    fontSize: 13,
    fontWeight: "600",
    color: "#171B20",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  customerName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#171B20",
    marginBottom: 2,
  },
  branchText: {
    fontSize: 12,
    color: "#5F6368",
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  dateText: {
    fontSize: 12,
    color: "#5F6368",
    marginBottom: 2,
  },
  itemsCount: {
    fontSize: 12,
    color: "#999",
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0057C0",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: "#5F6368",
    fontWeight: "500",
  },
});
