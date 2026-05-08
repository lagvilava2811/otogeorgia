export const locales = ['ka', 'ru', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ka';

type TranslationMap = {
  [key: string]: string;
};

type Translations = {
  [locale in Locale]: TranslationMap;
};

export const translations: Translations = {
  ka: {
    // Nav
    'nav.accumulators': 'აკუმლატორები',
    'nav.devices': 'მოწყობილობები',
    'nav.oil': 'ძრავის ზეთი',
    'nav.catalog': 'კატალოგი',
    
    // Hero
    'hero.badge': 'პრემიუმ ხარისხი — 2026',
    'hero.title1': 'ავტონაწილების',
    'hero.title2': 'პრემიუმ კატალოგი',
    'hero.subtitle': 'აკუმულატორები · ძრავის ზეთები · ავტო აქსესუარები',
    'hero.cta': 'კატალოგის ნახვა',
    'hero.categories': 'კატეგორიები',
    'hero.products': 'პროდუქტი',
    'hero.category': 'კატეგორია',
    'hero.support': 'მხარდაჭერა',
    'hero.scroll': 'SCROLL',
    
    // Sections
    'sections.categories': 'კატეგორიები',
    'sections.categories.title': 'აირჩიეთ მიმართულება',
    'sections.categories.desc': 'შეარჩიეთ თქვენთვის სასურველი კატეგორია და აღმოაჩინეთ უმაღლესი ხარისხის პროდუქცია',
    'sections.featured': 'გამორჩეული',
    'sections.featured.title': 'სპეციალური შეთავაზებები',
    'sections.featured.desc': 'ჩვენი ყველაზე მოთხოვნადი პროდუქტები საუკეთესო ფასად',
    'sections.catalog': 'სრული კატალოგი',
    'sections.cta.title': 'მზად ხართ?',
    'sections.cta.desc': 'აღმოაჩინეთ 450+ პროდუქტი საუკეთესო ფასად. უმაღლესი ხარისხი, პროფესიონალური მომსახურება.',
    'sections.premium': 'პრემიუმ ხარისხის პროდუქცია',
    'sections.browse': 'დათვალიერება',
    
    // Shop
    'shop.home': 'მთავარი',
    'shop.catalog': 'კატალოგი',
    'shop.all': 'ყველა პროდუქტი',
    'shop.allCategory': 'ყველა',
    'shop.products_in': 'პროდუქტი კატალოგში',
    'shop.products_in_cat': 'პროდუქტი კატეგორიაში',
    'shop.categories': 'კატეგორიები',
    'shop.not_found': 'პროდუქტები ვერ მოიძებნა',
    
    // Product
    'product.view': 'ნახვა',
    'product.add_to_cart': 'კალათაში',
    'product.specs': 'მახასიათებლები',
    
    // Cart
    'cart.title': 'კალათა',
    'cart.empty': 'კალათა ცარიელია',
    'cart.total': 'ჯამი',
    'cart.checkout': 'შეკვეთის გაფორმება',
    'cart.remove': 'წაშლა',
    
    // Footer
    'footer.desc': 'პრემიუმ ხარისხის ავტონაწილები, აკუმულატორები და ძრავის ზეთები.',
    'footer.nav': 'ნავიგაცია',
    'footer.home': 'მთავარი',
    'footer.catalog': 'კატალოგი',
    'footer.admin': 'ადმინ პანელი',
    'footer.categories': 'კატეგორიები',
    'footer.contact': 'კონტაქტი',
    'footer.rights': '© 2026 OTO GEORGIA. ყველა უფლება დაცულია.',
    
    // Admin
    'admin.panel': 'ადმინ პანელი',
  },
  
  ru: {
    // Nav
    'nav.accumulators': 'Аккумуляторы',
    'nav.devices': 'Инструменты',
    'nav.oil': 'Моторное масло',
    'nav.catalog': 'Каталог',
    
    // Hero
    'hero.badge': 'ПРЕМИУМ КАЧЕСТВО — 2026',
    'hero.title1': 'Автозапчасти',
    'hero.title2': 'Премиум каталог',
    'hero.subtitle': 'Аккумуляторы · Моторные масла · Автоаксессуары',
    'hero.cta': 'Смотреть каталог',
    'hero.categories': 'Категории',
    'hero.products': 'Товаров',
    'hero.category': 'Категории',
    'hero.support': 'Поддержка',
    'hero.scroll': 'SCROLL',
    
    // Sections
    'sections.categories': 'Категории',
    'sections.categories.title': 'Выберите направление',
    'sections.categories.desc': 'Выберите интересующую вас категорию и откройте для себя продукцию высочайшего качества',
    'sections.featured': 'Рекомендуемое',
    'sections.featured.title': 'Специальные предложения',
    'sections.featured.desc': 'Наши самые популярные товары по лучшим ценам',
    'sections.catalog': 'Полный каталог',
    'sections.cta.title': 'Готовы?',
    'sections.cta.desc': 'Откройте для себя 450+ товаров по лучшим ценам. Высочайшее качество, профессиональный сервис.',
    'sections.premium': 'Продукция премиум качества',
    'sections.browse': 'Смотреть',
    
    // Shop
    'shop.home': 'Главная',
    'shop.catalog': 'Каталог',
    'shop.all': 'Все товары',
    'shop.allCategory': 'Все',
    'shop.products_in': 'товаров в каталоге',
    'shop.products_in_cat': 'товаров в категории',
    'shop.categories': 'Категории',
    'shop.not_found': 'Товары не найдены',
    
    // Product
    'product.view': 'Подробнее',
    'product.add_to_cart': 'В корзину',
    'product.specs': 'Характеристики',
    
    // Cart
    'cart.title': 'Корзина',
    'cart.empty': 'Корзина пуста',
    'cart.total': 'Итого',
    'cart.checkout': 'Оформить заказ',
    'cart.remove': 'Удалить',
    
    // Footer
    'footer.desc': 'Автозапчасти, аккумуляторы и моторные масла премиум качества.',
    'footer.nav': 'Навигация',
    'footer.home': 'Главная',
    'footer.catalog': 'Каталог',
    'footer.admin': 'Панель администратора',
    'footer.categories': 'Категории',
    'footer.contact': 'Контакты',
    'footer.rights': '© 2026 OTO GEORGIA. Все права защищены.',
    
    // Admin
    'admin.panel': 'Панель администратора',
  },
  
  en: {
    // Nav
    'nav.accumulators': 'Batteries',
    'nav.devices': 'Tools',
    'nav.oil': 'Engine Oil',
    'nav.catalog': 'Catalog',
    
    // Hero
    'hero.badge': 'PREMIUM QUALITY — 2026',
    'hero.title1': 'Auto Parts',
    'hero.title2': 'Premium Catalog',
    'hero.subtitle': 'Batteries · Engine Oils · Auto Accessories',
    'hero.cta': 'View Catalog',
    'hero.categories': 'Categories',
    'hero.products': 'Products',
    'hero.category': 'Categories',
    'hero.support': 'Support',
    'hero.scroll': 'SCROLL',
    
    // Sections
    'sections.categories': 'Categories',
    'sections.categories.title': 'Choose Direction',
    'sections.categories.desc': 'Select your preferred category and discover the highest quality products',
    'sections.featured': 'Featured',
    'sections.featured.title': 'Special Offers',
    'sections.featured.desc': 'Our most popular products at the best prices',
    'sections.catalog': 'Full Catalog',
    'sections.cta.title': 'Ready?',
    'sections.cta.desc': 'Discover 450+ products at the best prices. Highest quality, professional service.',
    'sections.premium': 'Premium quality products',
    'sections.browse': 'Browse',
    
    // Shop
    'shop.home': 'Home',
    'shop.catalog': 'Catalog',
    'shop.all': 'All Products',
    'shop.allCategory': 'All',
    'shop.products_in': 'products in catalog',
    'shop.products_in_cat': 'products in category',
    'shop.categories': 'Categories',
    'shop.not_found': 'No products found',
    
    // Product
    'product.view': 'View',
    'product.add_to_cart': 'Add to Cart',
    'product.specs': 'Specifications',
    
    // Cart
    'cart.title': 'Cart',
    'cart.empty': 'Your cart is empty',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.remove': 'Remove',
    
    // Footer
    'footer.desc': 'Premium quality auto parts, batteries and engine oils.',
    'footer.nav': 'Navigation',
    'footer.home': 'Home',
    'footer.catalog': 'Catalog',
    'footer.admin': 'Admin Panel',
    'footer.categories': 'Categories',
    'footer.contact': 'Contact',
    'footer.rights': '© 2026 OTO GEORGIA. All rights reserved.',
    
    // Admin
    'admin.panel': 'Admin Panel',
  },
};

export function t(locale: Locale, key: string): string {
  return translations[locale]?.[key] || translations[defaultLocale][key] || key;
}
