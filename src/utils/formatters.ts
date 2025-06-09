// src/utils/formatters.ts

import { useTranslation } from "../hooks";
import { NAMESPACES } from "../i18n";

export const useFormatters = () => {
  const { t: tTime } = useTranslation(NAMESPACES.TIME);
  const { t: tMarketplace } = useTranslation(NAMESPACES.MARKETPLACE);

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return tTime("just_now");
    if (diffInMinutes < 60) return `${diffInMinutes}${tTime("minutes")}`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}${tTime("hours")}`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}${tTime("days")}`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}${tTime("weeks")}`;

    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}${tTime("months")}`;
  };

  const formatPrice = (price: number): string => {
    return (
      new Intl.NumberFormat("vi-VN").format(price) + tMarketplace("currency")
    );
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return {
    formatTimeAgo,
    formatPrice,
    formatNumber,
  };
};
