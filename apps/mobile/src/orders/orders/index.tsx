import React from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Order, OrderStatus } from "./types/PaginatedResponse";

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
    elevation: 3,
  },
  imageContainer: {
    position: "relative",
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: "#F1F3F5",
  },
  placeholderBox: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: "#F1F3F4",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 28,
  },
  sourceBadge: {
    position: "absolute",
    bottom: -6,
    alignSelf: "center",
    backgroundColor: "#171B20",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  sourceText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1D20",
    fontVariant: ["tabular-nums"],
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.2,
    textTransform: "uppercase",
  },
  customerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#171B20",
    marginTop: 4,
  },
  branchText: {
    fontSize: 12,
    color: "#6C757D",
    fontWeight: "500",
    marginTop: 1,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 8,
  },
  dateText: {
    fontSize: 11,
    color: "#6C757D",
  },
  itemsCount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#495057",
    marginTop: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: "800",
    color: "#171B20",
    fontVariant: ["tabular-nums"],
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 100,
  },
  emptyIcon: {
    fontSize: 44,
    marginBottom: 12,
  },
  emptyText: {
    color: "#6C757D",
    fontSize: 15,
    fontWeight: "500",
  },
});
