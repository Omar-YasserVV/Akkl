import { QuantityStepper } from "@/components/discovery/quantity-stepper";
import type { CartLineItem } from "@/context/cart-context";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface CartReviewRecommendation {
  id: string;
  name: string;
  price: number;
  image?: string | null;
  onAdd: () => void;
}

export interface CartReviewSummaryRow {
  label: string;
  value: string;
}

interface CartReviewScreenProps {
  title: string;
  branchName: string;
  items: CartLineItem[];
  summaryRows: CartReviewSummaryRow[];
  totalLabel?: string;
  total: string;
  ctaLabel: string;
  emptyTitle?: string;
  emptyActionLabel?: string;
  tableNumber?: string | null;
  recommendations?: CartReviewRecommendation[];
  onBack: () => void;
  onSubmit: () => void;
  onEmptyAction?: () => void;
  onQuantityChange: (
    itemId: string,
    quantity: number,
    variationId?: string,
  ) => void;
  onRemove: (itemId: string, variationId?: string) => void;
}

const fallbackImage =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";

const formatPrice = (price: number) => `${price.toFixed(2)} LE`;

export function CartReviewScreen({
  title,
  branchName,
  items,
  summaryRows,
  totalLabel = "Total",
  total,
  ctaLabel,
  emptyTitle = "Your cart is empty",
  emptyActionLabel = "Go Back to Menu",
  tableNumber,
  recommendations = [],
  onBack,
  onSubmit,
  onEmptyAction,
  onQuantityChange,
  onRemove,
}: CartReviewScreenProps) {
  const insets = useSafeAreaInsets();
  const hasItems = items.length > 0;

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={onBack} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={22} color="#0057C0" />
          </TouchableOpacity>
          <Text style={styles.branchTitle} numberOfLines={1}>
            {branchName}
          </Text>
          <Ionicons name="person-circle-outline" size={25} color="#596170" />
        </View>
        {tableNumber ? (
          <View style={styles.tableBanner}>
            <Ionicons name="restaurant" size={15} color="#0057C0" />
            <Text style={styles.tableText}>Serving to Table #{tableNumber}</Text>
          </View>
        ) : null}
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 94,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{title}</Text>

        {hasItems ? (
          <>
            {items.map((line) => (
              <CartReviewItem
                key={`${line.itemId}-${line.variationId ?? "base"}`}
                item={line}
                onQuantityChange={onQuantityChange}
                onRemove={onRemove}
              />
            ))}

            {recommendations.length > 0 ? (
              <>
                <View style={styles.recommendationHeader}>
                  <View style={styles.recommendationTitleWrap}>
                    <Ionicons name="sparkles" size={15} color="#0057C0" />
                    <Text style={styles.recommendationTitle}>
                      Recommended for You
                    </Text>
                  </View>
                  <Text style={styles.recommendationAll}>All</Text>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.recommendationList}
                >
                  {recommendations.map((item) => (
                    <RecommendationCard key={item.id} item={item} />
                  ))}
                </ScrollView>
              </>
            ) : null}

            <View style={styles.summary}>
              {summaryRows.map((row) => (
                <SummaryRow key={row.label} label={row.label} value={row.value} />
              ))}
              <View style={styles.divider} />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>{totalLabel}</Text>
                <Text style={styles.totalValue}>{total}</Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="cart-outline" size={72} color="#BEC8DA" />
            <Text style={styles.emptyTitle}>{emptyTitle}</Text>
            <TouchableOpacity
              onPress={onEmptyAction ?? onBack}
              style={styles.emptyButton}
              activeOpacity={0.88}
            >
              <Text style={styles.emptyButtonText}>{emptyActionLabel}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {hasItems ? (
        <View
          style={[
            styles.footer,
            { paddingBottom: insets.bottom + 12 },
          ]}
        >
          <TouchableOpacity
            onPress={onSubmit}
            activeOpacity={0.9}
            style={styles.cta}
          >
            <Text style={styles.ctaText}>{ctaLabel}</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

function CartReviewItem({
  item,
  onQuantityChange,
  onRemove,
}: {
  item: CartLineItem;
  onQuantityChange: (
    itemId: string,
    quantity: number,
    variationId?: string,
  ) => void;
  onRemove: (itemId: string, variationId?: string) => void;
}) {
  const description = item.variationLabel
    ? `Size: ${item.variationLabel}`
    : "Extra basil, thin crust";

  return (
    <View style={styles.itemCard}>
      <Image
        source={{ uri: item.image ?? fallbackImage }}
        style={styles.itemImage}
        contentFit="cover"
      />
      <View style={styles.itemBody}>
        <View style={styles.itemTopRow}>
          <View style={styles.itemNameWrap}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.itemDescription} numberOfLines={1}>
              {description}
            </Text>
          </View>
          <Text style={styles.itemPrice}>{formatPrice(item.unitPrice)}</Text>
        </View>
        <View style={styles.itemActionRow}>
          <QuantityStepper
            value={item.quantity}
            onChange={(quantity) =>
              onQuantityChange(item.itemId, quantity, item.variationId)
            }
          />
          <TouchableOpacity
            onPress={() => onRemove(item.itemId, item.variationId)}
            style={styles.removeButton}
            activeOpacity={0.85}
          >
            <Ionicons name="trash-outline" size={14} color="#E53935" />
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function RecommendationCard({ item }: { item: CartReviewRecommendation }) {
  return (
    <View style={styles.recommendationCard}>
      <Image
        source={{ uri: item.image ?? fallbackImage }}
        style={styles.recommendationImage}
        contentFit="cover"
      />
      <View style={styles.recommendationBody}>
        <Text style={styles.recommendationName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.recommendationPrice}>
          {formatPrice(item.price)}
        </Text>
      </View>
      <TouchableOpacity
        onPress={item.onAdd}
        style={styles.addRecommendation}
        activeOpacity={0.88}
      >
        <Ionicons name="add" size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

function SummaryRow({ label, value }: CartReviewSummaryRow) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },
  header: {
    backgroundColor: "#FFFFFF",
  },
  headerRow: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  iconButton: {
    height: 36,
    width: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  branchTitle: {
    flex: 1,
    color: "#0057C0",
    fontSize: 16,
    fontWeight: "800",
  },
  tableBanner: {
    height: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DDE6FF",
  },
  tableText: {
    marginLeft: 8,
    color: "#252B33",
    fontSize: 12,
    fontWeight: "800",
  },
  content: {
    flex: 1,
  },
  title: {
    marginTop: 18,
    marginBottom: 14,
    color: "#171B20",
    fontSize: 20,
    fontWeight: "800",
  },
  itemCard: {
    minHeight: 96,
    flexDirection: "row",
    marginBottom: 12,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E3E8F0",
    backgroundColor: "#FFFFFF",
  },
  itemImage: {
    width: 74,
    height: 74,
    borderRadius: 8,
    backgroundColor: "#EEF1F5",
  },
  itemBody: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  itemTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  itemNameWrap: {
    flex: 1,
    paddingRight: 8,
  },
  itemName: {
    color: "#1A1A1A",
    fontSize: 16,
    fontWeight: "800",
  },
  itemDescription: {
    marginTop: 3,
    color: "#7B8495",
    fontSize: 12,
    fontWeight: "700",
  },
  itemPrice: {
    color: "#171B20",
    fontSize: 14,
    fontWeight: "800",
  },
  itemActionRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  removeText: {
    marginLeft: 4,
    color: "#E53935",
    fontSize: 12,
    fontWeight: "800",
  },
  recommendationHeader: {
    marginTop: 8,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  recommendationTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  recommendationTitle: {
    marginLeft: 6,
    color: "#171B20",
    fontSize: 15,
    fontWeight: "800",
  },
  recommendationAll: {
    color: "#0057C0",
    fontSize: 12,
    fontWeight: "800",
  },
  recommendationList: {
    gap: 10,
    paddingBottom: 2,
  },
  recommendationCard: {
    width: 168,
    height: 78,
    flexDirection: "row",
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E8EBF0",
    backgroundColor: "#FFFFFF",
  },
  recommendationImage: {
    width: 54,
    height: 54,
    borderRadius: 8,
    backgroundColor: "#EEF1F5",
  },
  recommendationBody: {
    flex: 1,
    marginLeft: 8,
    paddingRight: 24,
  },
  recommendationName: {
    color: "#1A1A1A",
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 15,
  },
  recommendationPrice: {
    marginTop: 3,
    color: "#065FCC",
    fontSize: 12,
    fontWeight: "800",
  },
  addRecommendation: {
    position: "absolute",
    right: 8,
    bottom: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#065FCC",
  },
  summary: {
    marginTop: 16,
  },
  summaryRow: {
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryLabel: {
    color: "#5A6270",
    fontSize: 13,
    fontWeight: "600",
  },
  summaryValue: {
    color: "#1A1A1A",
    fontSize: 13,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    marginVertical: 4,
    backgroundColor: "#E8EBF0",
  },
  totalRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalLabel: {
    color: "#171B20",
    fontSize: 17,
    fontWeight: "800",
  },
  totalValue: {
    color: "#171B20",
    fontSize: 18,
    fontWeight: "800",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 56,
  },
  emptyTitle: {
    marginTop: 12,
    color: "#6E7682",
    fontSize: 17,
    fontWeight: "800",
  },
  emptyButton: {
    marginTop: 16,
    borderRadius: 9,
    backgroundColor: "#065FCC",
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: "#FFFFFF",
  },
  cta: {
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    backgroundColor: "#065FCC",
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});
