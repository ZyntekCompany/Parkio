export type PricingPlanFeature = {
  title: string;
};

export type PricingPlan = {
  title: string;
  price: string;
  billed: string;
  isMostPopular: boolean;
  list: {
    items: PricingPlanFeature[];
  };
};