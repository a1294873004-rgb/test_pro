import { useLingui } from '@lingui/react/macro';
import classNames from 'classnames';
import { useState } from 'react';
import { ISubscriptionAndPricingPlanItem, IUserInfo } from 'src/type';
import styles from './index.module.less';

enum PeriodType {
  Month = '1', // 月
  Year = '2', // 年
}

type SubscriptionPage = 'Preloading' | 'HomePage';
type PlanMap = Partial<Record<PeriodType, ISubscriptionAndPricingPlanItem[]>>;

const SubscriptionAndPricing: React.FC<
  {
    page: SubscriptionPage;
    onUpgradeClick?: (period: PeriodType, item: ISubscriptionAndPricingPlanItem) => Promise<void>;
    user?: IUserInfo;
    title?: string;
  } & ClassNameProps
> = ({ page, onUpgradeClick, className, user, title }) => {
  const { t } = useLingui(); // 这里是 hook
  const [pointsDetailOpen, setPointsDetailOpen] = useState(false);
  const [isSubscribePriceTab, setIsSubscribePriceTab] = useState<PeriodType>(PeriodType.Month);

  // const { data: monthData } = useRestQuery<ISubscriptionAndPricingPlanItem[]>(
  //   '/subscription/prices',
  //   { period: PeriodType.Month },
  //   { urlType: 'VITE_API_USER_URL', revalidateOnLangChange: true },
  // );

  // const { data: yearData } = useRestQuery<ISubscriptionAndPricingPlanItem[]>(
  //   '/subscription/prices',
  //   { period: PeriodType.Year },
  //   { urlType: 'VITE_API_USER_URL', revalidateOnLangChange: true },
  // );
  // const planMap: PlanMap = {
  //   [PeriodType.Month]: monthData?.data,
  //   [PeriodType.Year]: yearData?.data,
  // };
  // const displayPlans = planMap[isSubscribePriceTab];
  const getButtonText = (item: ISubscriptionAndPricingPlanItem, index: number) => {
    if (page === 'Preloading') {
      return t`升级`;
    }

    if (user?.vipStatus.vipState) {
      return item?.subscribed ? t`已订阅` : t`升级`;
    } else {
      return t`升级`;
    }
  };

  const getButtonDisabled = (item: ISubscriptionAndPricingPlanItem, index: number) => {
    if (page === 'Preloading') {
      return false;
    }
    // 已经是会员 ，都disabled
    if (user?.vipStatus.vipState) {
      return true;
    } else {
      return index === 0;
    }
  };

  const getCardClassName = (item: ISubscriptionAndPricingPlanItem, index: number) => {
    if (page === 'Preloading') {
      return styles.featured;
    }
    // 已经是会员 ，都disabled
    // if (user?.vipStatus.vipState) {
    //   return index == vipLevel ? styles.SubscriptionCard1 : styles.featured;
    // } else {
    //   return index == 0 ? styles.SubscriptionCard1 : styles.featured;
    // }
    return item.subscribed ? styles.SubscriptionCard1 : styles.featured;
  };

  const isShowBg = (item: ISubscriptionAndPricingPlanItem, index: number) => {
    if (page === 'Preloading') {
      return false;
    } else {
      return item.subscribed;
      // if (user?.vipStatus.vipState) {
      //   return item.subscribed;
      // } else {
      //   return index === 0;
      // }
    }
  };
  return (
    <div className={classNames(className, styles[page])}>
      <div className={styles.container}>
        <div className={styles.tabWrapper}>
          <div className={styles.tabs}>
            <div onClick={() => setIsSubscribePriceTab(PeriodType.Month)}>{t`按月`}</div>
            <div onClick={() => setIsSubscribePriceTab(PeriodType.Year)}>
              {t`按年`} <span className={styles.badge}>{t`减免2月`}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SubscriptionAndPricing };
