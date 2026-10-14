/*
 * SBW demo shim — автономная замена сервера для встраивания в статический сайт.
 * Перехватывает window.fetch для путей /api/* и отвечает по логике
 * D:\Pet\SBW\server\app.ts (расчёт quote, заказы, бонусы). Состояние — в памяти
 * страницы. Данные меню — фикстуры реального сервера (см. fixtures/).
 * Файл собирается скриптом inject-demo.cjs, метка FIXTURES_JSON ниже
 * заменяется на JSON фикстур при сборке.
 */
(function () {
  "use strict";
  if (window.__SBW_DEMO_SHIM__) return;
  window.__SBW_DEMO_SHIM__ = true;

  // Фикстуры реального сервера: GET /api/bootstrap, /api/me, /api/payment-methods
  // (сняты curl 14.10.2026, см. portfolio-site/.cache/sbw-demo/fixtures).
  var FIXTURES = {"bootstrap":{"demo":true,"products":[{"id":"sbw-melt","name":"SBW Мелт","description":"Ветчина, индейка, бекон и чеддер. Хлеб, овощи и до трёх соусов — на твой вкус.","category":"sandwiches","price":399,"weight":303,"calories":443.4,"image":"/brand/sbw-melt.webp","customizable":true,"defaultSauce":"Чесночный ранч"},{"id":"bavarskii","name":"Баварский","description":"Куриные колбаски со свиным шпиком, крем-сыр, айсберг, томаты, маринованные огурцы и жареный лук. Соус: Медовая горчица и 1000 островов.","category":"sandwiches","price":349,"weight":317,"calories":713,"image":"/brand/bavarskii.webp","customizable":false,"closedRecipe":true,"badge":"Готовое решение","defaultSauce":"Медовая горчица"},{"id":"beef","name":"Биф Гриль","description":"Говяжья котлета, бекон, чеддер, айсберг, красный лук и маринованные огурцы. Соус: Гриль.","category":"sandwiches","price":399,"weight":279,"calories":564,"image":"/brand/beef.webp","customizable":false,"closedRecipe":true,"badge":"Готовое решение","defaultSauce":"Гриль"},{"id":"pozharskii","name":"Пожарский","description":"Куриная котлета в панировке, крем-сыр, айсберг, томаты, маринованные огурцы, красный и жареный лук. Соус: Чесночный ранч и сметанный.","category":"sandwiches","price":389,"weight":350,"calories":759,"image":"/brand/pozharskii.webp","customizable":false,"closedRecipe":true,"badge":"Сезонный","defaultSauce":"Чесночный ранч"},{"id":"stroganov","name":"Строганов","description":"Томлёная говядина, крем-сыр, шампиньоны, айсберг, маринованные огурцы, красный и жареный лук. Соус: Сметанный.","category":"sandwiches","price":429,"weight":354,"calories":856,"image":"/brand/stroganov.webp","customizable":false,"closedRecipe":true,"badge":"Сезонный","defaultSauce":"Сметанный"},{"id":"ham","name":"Ветчина","description":"Ветчина и чеддер. Хлеб, овощи и до трёх соусов — на твой вкус.","category":"sandwiches","price":349,"weight":273,"calories":418,"image":"/brand/ham.webp","customizable":true,"defaultSauce":"Чесночный ранч"},{"id":"beef-club","name":"Биф Клаб мелт","description":"Говяжья котлета и чеддер. Хлеб, овощи и до трёх соусов — на твой вкус.","category":"sandwiches","price":399,"weight":295,"calories":433.1,"image":"/brand/beef-club.webp","customizable":true,"defaultSauce":"Гриль"},{"id":"mega-chicken","name":"Мега Чикен","description":"Куриная котлета в панировке и чеддер. Хлеб, овощи и до трёх соусов — на твой вкус.","category":"sandwiches","price":389,"weight":334,"calories":490.4,"image":"/brand/mega-chicken.webp","customizable":true,"defaultSauce":"Чесночный ранч"},{"id":"veggie","name":"Овощной","description":"Свежие овощи и чеддер. Хлеб, овощи и до трёх соусов — на твой вкус.","category":"sandwiches","price":279,"weight":229,"calories":290.4,"image":"/brand/veggie.webp","customizable":true,"vegetarian":true,"defaultSauce":"Сырный"},{"id":"mushroom-roll","name":"Ролл Грибной","description":"Шампиньоны со специями и чеддер. В пшеничной тортилье. Овощи и соусы можно выбрать.","category":"rolls","price":299,"weight":247,"calories":518,"image":"/brand/mushroom-roll.webp","customizable":true,"vegetarian":true,"defaultSauce":"Сырный"},{"id":"beef-salad","name":"Салат Биф гриль","description":"Говяжья котлета, бекон, чеддер, айсберг, красный лук и маринованные огурцы. Соус: Гриль.","category":"salads","price":379,"weight":309,"calories":388,"image":"/brand/beef-salad.webp","customizable":false,"closedRecipe":true,"badge":"Готовое решение"},{"id":"potato","name":"Картофельные дольки (маленькая порция)","description":"Небольшая порция картофельных долек к сабу.","category":"snacks","price":139,"weight":130,"calories":182,"image":"/brand/potato.webp","customizable":false},{"id":"bubble-tea","name":"Бабл-ти манго-маракуйя","description":"Чайный напиток с манго, маракуйей и джус-боллами.","category":"drinks","price":249,"weight":500,"calories":200,"image":"/brand/bubble-tea.webp","customizable":false,"badge":"Сезонный"},{"id":"cookie","name":"Кукис","description":"Печенье с мягкой серединкой и хрустящими краями.","category":"desserts","price":99,"weight":45,"calories":75.2,"image":"/brand/cookie.webp","customizable":false},{"id":"derevenskiy","name":"Деревенский","description":"Карбонад, бекон, шампиньоны, картофельные дольки, чеддер, айсберг, маринованные огурцы, красный и жареный лук. Соус: Чесночный ранч.","category":"sandwiches","price":429,"weight":316,"calories":645,"image":"/brand/derevenskiy.webp","customizable":false,"closedRecipe":true,"badge":"Готовое решение"},{"id":"chiken-dabl-chiz","name":"Чикен Дабл Чиз","description":"Куриные кусочки, чеддер, моцарелла, овощи, маслины и жареный лук. Соус: Тысяча островов.","category":"sandwiches","price":399,"weight":310,"calories":147.6,"image":"/brand/chiken-dabl-chiz.webp","customizable":false,"closedRecipe":true,"badge":"Готовое решение"},{"id":"rostbif-de-lyuks","name":"Ростбиф Де Люкс","description":"Ростбиф, крем-сыр, вяленые томаты, салат и маслины. Соус: Сладкий лук и медовая горчица.","category":"sandwiches","price":449,"weight":266,"calories":592,"image":"/brand/rostbif-de-lyuks.webp","customizable":false,"closedRecipe":true,"badge":"Готовое решение"},{"id":"fish-sab","name":"Фиш саб","description":"Котлета из филе минтая в панировке и моцарелла. Хлеб, овощи и до трёх соусов — на твой вкус.","category":"sandwiches","price":369,"weight":289,"calories":482.1,"image":"/brand/fish-sab.webp","customizable":true,"defaultSauce":"Чесночный ранч"},{"id":"italyanskiy-bmt","name":"Итальянский БМТ","description":"Пеперони, салями, ветчина и чеддер. Хлеб, овощи и до трёх соусов — на твой вкус.","category":"sandwiches","price":379,"weight":281,"calories":441.2,"image":"/brand/italyanskiy-bmt.webp","customizable":true,"defaultSauce":"Чипотл Саусвест"},{"id":"alpiyskiy","name":"Альпийский","description":"Пикантные колбаски и чеддер. Хлеб, овощи и до трёх соусов — на твой вкус.","category":"sandwiches","price":349,"weight":309,"calories":570.4,"image":"/brand/alpiyskiy.webp","customizable":true,"defaultSauce":"Медовая горчица"},{"id":"monstr","name":"Монстр","description":"Индейка, бекон, ветчина, ростбиф, пеперони, двойной чеддер, айсберг, томаты, свежие и маринованные огурцы, красный и жареный лук, маслины. Соус: Сырный, чипотл саусвест и 1000 островов.","category":"sandwiches","price":549,"weight":391,"calories":606,"image":"/brand/monstr.webp","customizable":false,"closedRecipe":true,"badge":"Готовое решение"},{"id":"svinina-barbekyu","name":"Свинина Барбекю","description":"Свинина в соусе барбекю и чеддер. Хлеб, овощи и до трёх соусов — на твой вкус.","category":"sandwiches","price":399,"weight":307,"calories":414,"image":"/brand/svinina-barbekyu.webp","customizable":true,"defaultSauce":"Барбекю"},{"id":"kuritsa-barbekyu","name":"Курица Барбекю","description":"Рваная курица в соусе барбекю и чеддер. Хлеб, овощи и до трёх соусов — на твой вкус.","category":"sandwiches","price":399,"weight":319,"calories":432,"image":"/brand/kuritsa-barbekyu.webp","customizable":true,"defaultSauce":"Барбекю"},{"id":"losos-krem-chiz","name":"Лосось Крем-Чиз","description":"Слабосолёный лосось и крем-сыр. Хлеб, овощи и до трёх соусов — на твой вкус.","category":"sandwiches","price":449,"weight":307,"calories":472.9,"image":"/brand/losos-krem-chiz.webp","customizable":true,"defaultSauce":"Чесночный ранч"},{"id":"kuritsa-bekon","name":"Курица Бекон","description":"Курица, бекон и чеддер. Хлеб, овощи и до трёх соусов — на твой вкус.","category":"sandwiches","price":399,"weight":308,"calories":421.6,"image":"/brand/kuritsa-bekon.webp","customizable":true,"defaultSauce":"Чесночный ранч"},{"id":"rostbif","name":"Ростбиф","description":"Ростбиф и чеддер. Хлеб, овощи и до трёх соусов — на твой вкус.","category":"sandwiches","price":429,"weight":274,"calories":344.4,"image":"/brand/rostbif.webp","customizable":true,"defaultSauce":"Медовая горчица"},{"id":"kuritsa-teriyaki","name":"Курица Терияки","description":"Куриное филе в соусе терияки и чеддер. Хлеб, овощи и до трёх соусов — на твой вкус.","category":"sandwiches","price":389,"weight":303,"calories":382.3,"image":"/brand/kuritsa-teriyaki.webp","customizable":true,"defaultSauce":"Сладкий лук"},{"id":"sbw-klab","name":"SBW Клаб","description":"Ветчина, индейка, ростбиф и чеддер. Хлеб, овощи и до трёх соусов — на твой вкус.","category":"sandwiches","price":429,"weight":300,"calories":379.3,"image":"/brand/sbw-klab.webp","customizable":true,"defaultSauce":"Медовая горчица"},{"id":"gribnoy","name":"Грибной","description":"Шампиньоны со специями и чеддер. Хлеб, овощи и до трёх соусов — на твой вкус.","category":"sandwiches","price":329,"weight":289,"calories":445.4,"image":"/brand/gribnoy.webp","customizable":true,"vegetarian":true,"defaultSauce":"Сырный"},{"id":"ostryy-italyanskiy","name":"Острый Итальянский","description":"Салями, пеперони и чеддер. Хлеб, овощи и до трёх соусов — на твой вкус.","category":"sandwiches","price":349,"weight":279,"calories":435.4,"image":"/brand/ostryy-italyanskiy.webp","customizable":true,"defaultSauce":"Чипотл Саусвест"},{"id":"tunets","name":"Тунец","description":"Тунец в лёгком майонезном соусе и чеддер. Хлеб, овощи и до трёх соусов — на твой вкус.","category":"sandwiches","price":389,"weight":289,"calories":416.3,"image":"/brand/tunets.webp","customizable":true,"defaultSauce":"Майонез лёгкий"},{"id":"kurinaya-grudka","name":"Куриная грудка","description":"Куриная грудка и чеддер. Хлеб, овощи и до трёх соусов — на твой вкус.","category":"sandwiches","price":349,"weight":289,"calories":375.5,"image":"/brand/kurinaya-grudka.webp","customizable":true,"defaultSauce":"Чесночный ранч"},{"id":"indeyka-vetchina","name":"Индейка / Ветчина","description":"Индейка, ветчина и чеддер. Хлеб, овощи и до трёх соусов — на твой вкус.","category":"sandwiches","price":349,"weight":281,"calories":375.2,"image":"/brand/indeyka-vetchina.webp","customizable":true,"defaultSauce":"Медовая горчица"},{"id":"indeyka","name":"Индейка","description":"Индейка и чеддер. Хлеб, овощи и до трёх соусов — на твой вкус.","category":"sandwiches","price":329,"weight":274,"calories":321.9,"image":"/brand/indeyka.webp","customizable":true,"defaultSauce":"Медовая горчица"},{"id":"roll-stroganov","name":"Ролл Строганов","description":"Томлёная говядина, крем-сыр, шампиньоны, айсберг, маринованные огурцы, красный и жареный лук. Соус: Сметанный.","category":"rolls","price":399,"weight":341,"calories":880,"image":"/brand/roll-stroganov.webp","customizable":false,"closedRecipe":true,"badge":"Сезонный"},{"id":"roll-pozharskiy","name":"Ролл Пожарский","description":"Куриная котлета в панировке, крем-сыр, айсберг, томаты, маринованные огурцы, красный и жареный лук. Соус: Чесночный ранч и сметанный.","category":"rolls","price":359,"weight":316,"calories":778,"image":"/brand/roll-pozharskiy.webp","customizable":false,"closedRecipe":true,"badge":"Сезонный"},{"id":"roll-losos-krem-chiz","name":"Ролл Лосось Крем-чиз","description":"Слабосолёный лосось и крем-сыр. В пшеничной тортилье. Овощи и соусы можно выбрать.","category":"rolls","price":419,"weight":265,"calories":488,"image":"/brand/roll-losos-krem-chiz.webp","customizable":true,"defaultSauce":"Чесночный ранч"},{"id":"roll-sbw-klab","name":"Ролл SBW Клаб","description":"Ветчина, индейка, ростбиф и чеддер. В пшеничной тортилье. Овощи и соусы можно выбрать.","category":"rolls","price":399,"weight":258,"calories":420,"image":"/brand/roll-sbw-klab.webp","customizable":true,"defaultSauce":"Медовая горчица"},{"id":"roll-bif-klab-melt","name":"Ролл Биф Клаб Мелт","description":"Говяжья котлета и чеддер. В пшеничной тортилье. Овощи и соусы можно выбрать.","category":"rolls","price":369,"weight":252,"calories":511,"image":"/brand/roll-bif-klab-melt.webp","customizable":true,"defaultSauce":"Гриль"},{"id":"roll-fish-sab","name":"Ролл Фиш саб","description":"Котлета из филе минтая в панировке и моцарелла. В пшеничной тортилье. Овощи и соусы можно выбрать.","category":"rolls","price":339,"weight":285,"calories":514,"image":"/brand/roll-fish-sab.webp","customizable":true,"defaultSauce":"Чесночный ранч"},{"id":"roll-indeyka","name":"Ролл Индейка","description":"Индейка и чеддер. В пшеничной тортилье. Овощи и соусы можно выбрать.","category":"rolls","price":299,"weight":232,"calories":386,"image":"/brand/roll-indeyka.webp","customizable":true,"defaultSauce":"Медовая горчица"},{"id":"roll-kuritsa-teriyaki","name":"Ролл Курица Терияки","description":"Куриное филе в соусе терияки и чеддер. В пшеничной тортилье. Овощи и соусы можно выбрать.","category":"rolls","price":359,"weight":261,"calories":440,"image":"/brand/roll-kuritsa-teriyaki.webp","customizable":true,"defaultSauce":"Сладкий лук"},{"id":"roll-ostryy-italyanskiy","name":"Ролл Острый Итальянский","description":"Салями, пеперони и чеддер. В пшеничной тортилье. Овощи и соусы можно выбрать.","category":"rolls","price":319,"weight":237,"calories":493,"image":"/brand/roll-ostryy-italyanskiy.webp","customizable":true,"defaultSauce":"Чипотл Саусвест"},{"id":"roll-alpiyskiy","name":"Ролл Альпийский","description":"Пикантные колбаски и чеддер. В пшеничной тортилье. Овощи и соусы можно выбрать.","category":"rolls","price":319,"weight":267,"calories":628,"image":"/brand/roll-alpiyskiy.webp","customizable":true,"defaultSauce":"Медовая горчица"},{"id":"roll-ovoschnoy","name":"Ролл Овощной","description":"Свежие овощи и чеддер. В пшеничной тортилье. Овощи и соусы можно выбрать.","category":"rolls","price":249,"weight":187,"calories":348,"image":"/brand/roll-ovoschnoy.webp","customizable":true,"vegetarian":true,"defaultSauce":"Сырный"},{"id":"roll-kurinaya-grudka","name":"Ролл Куриная Грудка","description":"Куриная грудка и чеддер. В пшеничной тортилье. Овощи и соусы можно выбрать.","category":"rolls","price":319,"weight":247,"calories":420,"image":"/brand/roll-kurinaya-grudka.webp","customizable":true,"defaultSauce":"Чесночный ранч"},{"id":"roll-mega-chiken","name":"Ролл Мега Чикен","description":"Куриная котлета в панировке и чеддер. В пшеничной тортилье. Овощи и соусы можно выбрать.","category":"rolls","price":359,"weight":292,"calories":610,"image":"/brand/roll-mega-chiken.webp","customizable":true,"defaultSauce":"Чесночный ранч"},{"id":"roll-kuritsa-bekon","name":"Ролл Курица Бекон","description":"Курица, бекон и чеддер. В пшеничной тортилье. Овощи и соусы можно выбрать.","category":"rolls","price":369,"weight":269,"calories":488,"image":"/brand/roll-kuritsa-bekon.webp","customizable":true,"defaultSauce":"Чесночный ранч"},{"id":"roll-tunets","name":"Ролл Тунец","description":"Тунец в лёгком майонезном соусе и чеддер. В пшеничной тортилье. Овощи и соусы можно выбрать.","category":"rolls","price":359,"weight":251,"calories":458,"image":"/brand/roll-tunets.webp","customizable":true,"defaultSauce":"Майонез лёгкий"},{"id":"roll-vetchina","name":"Ролл Ветчина","description":"Ветчина и чеддер. В пшеничной тортилье. Овощи и соусы можно выбрать.","category":"rolls","price":319,"weight":231,"calories":389,"image":"/brand/roll-vetchina.webp","customizable":true,"defaultSauce":"Чесночный ранч"},{"id":"roll-sbw-melt","name":"Ролл SBW Мелт","description":"Ветчина, индейка, бекон и чеддер. В пшеничной тортилье. Овощи и соусы можно выбрать.","category":"rolls","price":369,"weight":261,"calories":462,"image":"/brand/roll-sbw-melt.webp","customizable":true,"defaultSauce":"Чесночный ранч"},{"id":"roll-italyanskiy-bmt","name":"Ролл Итальянский БМТ","description":"Пеперони, салями, ветчина и чеддер. В пшеничной тортилье. Овощи и соусы можно выбрать.","category":"rolls","price":349,"weight":217,"calories":435,"image":"/brand/roll-italyanskiy-bmt.webp","customizable":true,"defaultSauce":"Чипотл Саусвест"},{"id":"roll-rostbif","name":"Ролл Ростбиф","description":"Ростбиф и чеддер. В пшеничной тортилье. Овощи и соусы можно выбрать.","category":"rolls","price":399,"weight":232,"calories":402,"image":"/brand/roll-rostbif.webp","customizable":true,"defaultSauce":"Медовая горчица"},{"id":"roll-indeyka-vetchina","name":"Ролл Индейка Ветчина","description":"Индейка, ветчина и чеддер. В пшеничной тортилье. Овощи и соусы можно выбрать.","category":"rolls","price":319,"weight":239,"calories":394,"image":"/brand/roll-indeyka-vetchina.webp","customizable":true,"defaultSauce":"Медовая горчица"},{"id":"salat-pozharskiy","name":"Салат Пожарский","description":"Куриная котлета в панировке, крем-сыр, айсберг, томаты, маринованные огурцы, красный и жареный лук. Соус: Чесночный ранч и сметанный.","category":"salads","price":369,"weight":372,"calories":573,"image":"/brand/salat-pozharskiy.webp","customizable":false,"closedRecipe":true,"badge":"Сезонный"},{"id":"salat-stroganov","name":"Салат Строганов","description":"Томлёная говядина, крем-сыр, шампиньоны, айсберг, маринованные огурцы, красный и жареный лук. Соус: Сметанный.","category":"salads","price":409,"weight":488,"calories":679,"image":"/brand/salat-stroganov.webp","customizable":false,"closedRecipe":true,"badge":"Сезонный"},{"id":"salat-monstr","name":"Салат Монстр","description":"Индейка, бекон, ветчина, ростбиф, пеперони, двойной чеддер, айсберг, томаты, свежие и маринованные огурцы, красный и жареный лук, маслины. Соус: Сырный, чипотл саусвест и 1000 островов.","category":"salads","price":529,"weight":386,"calories":426,"image":"/brand/salat-monstr.webp","customizable":false,"closedRecipe":true,"badge":"Готовое решение"},{"id":"salat-derevenskiy","name":"Салат Деревенский","description":"Карбонад, бекон, шампиньоны, картофельные дольки, чеддер, айсберг, маринованные огурцы, красный и жареный лук. Соус: Чесночный ранч.","category":"salads","price":409,"weight":388,"calories":480,"image":"/brand/salat-derevenskiy.webp","customizable":false,"closedRecipe":true,"badge":"Готовое решение"},{"id":"salat-bavarskiy","name":"Салат Баварский","description":"Куриные колбаски со свиным шпиком, крем-сыр, айсберг, томаты, маринованные огурцы и жареный лук. Соус: Медовая горчица и 1000 островов.","category":"salads","price":329,"weight":332,"calories":494,"image":"/brand/salat-bavarskiy.webp","customizable":false,"closedRecipe":true,"badge":"Готовое решение"},{"id":"salat-rostbif-de-lyuks","name":"Салат Ростбиф де люкс","description":"Ростбиф, крем-сыр, вяленые томаты, салат и маслины. Соус: Сладкий лук и медовая горчица.","category":"salads","price":429,"weight":325,"calories":393,"image":"/brand/salat-rostbif-de-lyuks.webp","customizable":false,"closedRecipe":true,"badge":"Готовое решение"},{"id":"salat-chiken-dabl-chiz","name":"Салат Чикен Дабл Чиз","description":"Куриные кусочки, чеддер, моцарелла, овощи, маслины и жареный лук. Соус: Тысяча островов.","category":"salads","price":379,"weight":302,"calories":456,"image":"/brand/salat-chiken-dabl-chiz.webp","customizable":false,"closedRecipe":true,"badge":"Готовое решение"},{"id":"salat-gribnoy","name":"Салат Грибной","description":"Шампиньоны со специями и чеддер. На овощной основе. Овощи и соусы можно выбрать.","category":"salads","price":309,"weight":282,"calories":313,"image":"/brand/salat-gribnoy.webp","customizable":true,"vegetarian":true,"defaultSauce":"Сырный"},{"id":"salat-fish-sab","name":"Салат Фиш саб","description":"Котлета из филе минтая в панировке и моцарелла. На овощной основе. Овощи и соусы можно выбрать.","category":"salads","price":349,"weight":312,"calories":299,"image":"/brand/salat-fish-sab.webp","customizable":true,"defaultSauce":"Чесночный ранч"},{"id":"salat-bif-klab-melt","name":"Салат Биф Клаб Мелт","description":"Говяжья котлета и чеддер. На овощной основе. Овощи и соусы можно выбрать.","category":"salads","price":379,"weight":287,"calories":306,"image":"/brand/salat-bif-klab-melt.webp","customizable":true,"defaultSauce":"Гриль"},{"id":"salat-losos-krem-chiz","name":"Салат Лосось Крем-Чиз","description":"Слабосолёный лосось и крем-сыр. На овощной основе. Овощи и соусы можно выбрать.","category":"salads","price":429,"weight":304,"calories":275,"image":"/brand/salat-losos-krem-chiz.webp","customizable":true,"defaultSauce":"Чесночный ранч"},{"id":"salat-indeyka","name":"Салат Индейка","description":"Индейка и чеддер. На овощной основе. Овощи и соусы можно выбрать.","category":"salads","price":309,"weight":267,"calories":181,"image":"/brand/salat-indeyka.webp","customizable":true,"defaultSauce":"Медовая горчица"},{"id":"salat-megachiken","name":"Салат Мегачикен","description":"Куриная котлета в панировке и чеддер. На овощной основе. Овощи и соусы можно выбрать.","category":"salads","price":369,"weight":327,"calories":406,"image":"/brand/salat-megachiken.webp","customizable":true,"defaultSauce":"Чесночный ранч"},{"id":"salat-ostryy-italyanskiy","name":"Салат Острый Итальянский","description":"Салями, пеперони и чеддер. На овощной основе. Овощи и соусы можно выбрать.","category":"salads","price":329,"weight":272,"calories":288,"image":"/brand/salat-ostryy-italyanskiy.webp","customizable":true,"defaultSauce":"Чипотл Саусвест"},{"id":"salat-vetchina","name":"Салат Ветчина","description":"Ветчина и чеддер. На овощной основе. Овощи и соусы можно выбрать.","category":"salads","price":329,"weight":265,"calories":185,"image":"/brand/salat-vetchina.webp","customizable":true,"defaultSauce":"Чесночный ранч"},{"id":"salat-tunets","name":"Салат Тунец","description":"Тунец в лёгком майонезном соусе и чеддер. На овощной основе. Овощи и соусы можно выбрать.","category":"salads","price":369,"weight":286,"calories":254,"image":"/brand/salat-tunets.webp","customizable":true,"defaultSauce":"Майонез лёгкий"},{"id":"salat-kuritsa-teriyaki","name":"Салат Курица Терияки","description":"Куриное филе в соусе терияки и чеддер. На овощной основе. Овощи и соусы можно выбрать.","category":"salads","price":369,"weight":296,"calories":235,"image":"/brand/salat-kuritsa-teriyaki.webp","customizable":true,"defaultSauce":"Сладкий лук"},{"id":"salat-kuritsa-bekon-melt","name":"Салат Курица Бекон Мелт","description":"Курица, бекон и чеддер. На овощной основе. Овощи и соусы можно выбрать.","category":"salads","price":379,"weight":304,"calories":283,"image":"/brand/salat-kuritsa-bekon-melt.webp","customizable":true,"defaultSauce":"Чесночный ранч"},{"id":"salat-sbw-klab","name":"Салат SBW Клаб","description":"Ветчина, индейка, ростбиф и чеддер. На овощной основе. Овощи и соусы можно выбрать.","category":"salads","price":409,"weight":293,"calories":215,"image":"/brand/salat-sbw-klab.webp","customizable":true,"defaultSauce":"Медовая горчица"},{"id":"salat-kurinaya-grudka","name":"Салат Куриная Грудка","description":"Куриная грудка и чеддер. На овощной основе. Овощи и соусы можно выбрать.","category":"salads","price":329,"weight":282,"calories":215,"image":"/brand/salat-kurinaya-grudka.webp","customizable":true,"defaultSauce":"Чесночный ранч"},{"id":"salat-alpiyskiy","name":"Салат Альпийский","description":"Пикантные колбаски и чеддер. На овощной основе. Овощи и соусы можно выбрать.","category":"salads","price":329,"weight":302,"calories":423,"image":"/brand/salat-alpiyskiy.webp","customizable":true,"defaultSauce":"Медовая горчица"},{"id":"salat-sbw-melt","name":"Салат SBW Мелт","description":"Ветчина, индейка, бекон и чеддер. На овощной основе. Овощи и соусы можно выбрать.","category":"salads","price":379,"weight":296,"calories":258,"image":"/brand/salat-sbw-melt.webp","customizable":true,"defaultSauce":"Чесночный ранч"},{"id":"salat-ovoschnoy","name":"Салат Овощной","description":"Свежие овощи и чеддер. На овощной основе. Овощи и соусы можно выбрать.","category":"salads","price":259,"weight":222,"calories":143,"image":"/brand/salat-ovoschnoy.webp","customizable":true,"vegetarian":true,"defaultSauce":"Сырный"},{"id":"salat-rostbif","name":"Салат Ростбиф","description":"Ростбиф и чеддер. На овощной основе. Овощи и соусы можно выбрать.","category":"salads","price":409,"weight":267,"calories":197,"image":"/brand/salat-rostbif.webp","customizable":true,"defaultSauce":"Медовая горчица"},{"id":"salat-italyanskiy-bmt","name":"Салат Итальянский БМТ","description":"Пеперони, салями, ветчина и чеддер. На овощной основе. Овощи и соусы можно выбрать.","category":"salads","price":359,"weight":274,"calories":251,"image":"/brand/salat-italyanskiy-bmt.webp","customizable":true,"defaultSauce":"Чипотл Саусвест"},{"id":"salat-indeyka-vetchina","name":"Салат Индейка-Ветчина","description":"Индейка, ветчина и чеддер. На овощной основе. Овощи и соусы можно выбрать.","category":"salads","price":329,"weight":274,"calories":189,"image":"/brand/salat-indeyka-vetchina.webp","customizable":true,"defaultSauce":"Медовая горчица"},{"id":"dvoynoy-sabdog","name":"Двойной сабдог","description":"Две альпийские колбаски в булочке, жареный лук и маринованный огурец.","category":"snacks","price":249,"weight":224,"calories":464,"image":"/brand/dvoynoy-sabdog.webp","customizable":false},{"id":"sabdog-s-bekonom-i-syrom","name":"Сабдог с беконом и сыром","description":"Альпийская колбаска, бекон и сыр в булочке с жареным луком и маринованным огурцом.","category":"snacks","price":229,"weight":140,"calories":413.7,"image":"/brand/sabdog-s-bekonom-i-syrom.webp","customizable":false},{"id":"sabdog-s-bekonom","name":"Сабдог с беконом","description":"Альпийская колбаска с беконом, жареным луком и маринованным огурцом в булочке.","category":"snacks","price":199,"weight":134,"calories":392.6,"image":"/brand/sabdog-s-bekonom.webp","customizable":false},{"id":"sabdog-s-syrom","name":"Сабдог с сыром","description":"Альпийская колбаска с сыром, жареным луком и маринованным огурцом в булочке.","category":"snacks","price":189,"weight":129,"calories":379.6,"image":"/brand/sabdog-s-syrom.webp","customizable":false},{"id":"sabdog","name":"Сабдог","description":"Альпийская колбаска в булочке с жареным луком и маринованным огурцом.","category":"snacks","price":169,"weight":123,"calories":358.5,"image":"/brand/sabdog.webp","customizable":false},{"id":"naggetsy-10-sht","name":"Наггетсы 10 шт","description":"Десять куриных наггетсов в панировке.","category":"snacks","price":259,"weight":200,"calories":292,"image":"/brand/naggetsy-10-sht.webp","customizable":false},{"id":"naggetsy-5-sht","name":"Наггетсы 5 шт","description":"Пять куриных наггетсов в панировке.","category":"snacks","price":159,"weight":100,"calories":146,"image":"/brand/naggetsy-5-sht.webp","customizable":false},{"id":"syrnye-palochki","name":"Сырные палочки","description":"Расплавленный сыр в хрустящей панировке.","category":"snacks","price":219,"weight":120,"calories":324,"image":"/brand/syrnye-palochki.webp","customizable":false},{"id":"kheshbrauny","name":"Хэшбрауны","description":"Две картофельные оладьи с золотистой корочкой.","category":"snacks","price":99,"weight":45,"calories":75.2,"image":"/brand/kheshbrauny.webp","customizable":false},{"id":"dipper-kuritsa-syr","name":"Диппер Курица сыр","description":"Куриные кусочки и чеддер в поджаренной лепёшке. С медовой горчицей.","category":"snacks","price":199,"weight":167,"calories":400,"image":"/brand/dipper-kuritsa-syr.webp","customizable":false},{"id":"dipper-peperoni-syr","name":"Диппер Пеперони сыр","description":"Пеперони и чеддер в поджаренной лепёшке. С соусом чипотл саусвест.","category":"snacks","price":199,"weight":132,"calories":405,"image":"/brand/dipper-peperoni-syr.webp","customizable":false},{"id":"dipper-dvoynoy-syr","name":"Диппер Двойной сыр","description":"Поджаренная лепёшка с чеддером и сырным соусом.","category":"snacks","price":179,"weight":127,"calories":380,"image":"/brand/dipper-dvoynoy-syr.webp","customizable":false},{"id":"kartofelnye-dolki-bolshaya-portsiya","name":"Картофельные дольки (большая порция)","description":"Большая порция запечённых картофельных долек.","category":"snacks","price":239,"weight":260,"calories":473,"image":"/brand/kartofelnye-dolki-bolshaya-portsiya.webp","customizable":false},{"id":"babl-kofe-chernika-maskarpone","name":"Бабл-кофе черника-маскарпоне","description":"Кофе с черникой, маскарпоне и йогуртовыми джус-боллами.","category":"drinks","price":249,"weight":500,"calories":220,"image":"/brand/babl-kofe-chernika-maskarpone.webp","customizable":false,"badge":"Сезонный"},{"id":"mokhito","name":"Мохито","description":"Освежающий мохито, порция 500 мл.","category":"drinks","price":249,"weight":500,"calories":251,"image":"/brand/mokhito.webp","customizable":false,"badge":"Сезонный"},{"id":"spritts-b-a-apelsin","name":"Спритц б/а Апельсин","description":"Безалкогольный апельсиновый спритц с газировкой.","category":"drinks","price":249,"weight":500,"calories":260,"image":"/brand/spritts-b-a-apelsin.webp","customizable":false,"badge":"Сезонный"},{"id":"syrniki","name":"Сырники","description":"Творожные сырники к завтраку или напитку.","category":"desserts","price":149,"weight":140,"calories":309,"image":"/brand/syrniki.webp","customizable":false},{"id":"klenovyy-pekan","name":"Кленовый пекан","description":"Слоёная выпечка с кленовой начинкой и пеканом.","category":"desserts","price":149,"weight":100,"calories":440,"image":"/brand/klenovyy-pekan.webp","customizable":false},{"id":"donat","name":"Донат","description":"Донат с глазурью.","category":"desserts","price":149,"weight":120,"calories":324,"image":"/brand/donat.webp","customizable":false},{"id":"maffin","name":"Маффин","description":"Мягкий маффин к чаю или кофе.","category":"desserts","price":149,"weight":100,"calories":146,"image":"/brand/maffin.webp","customizable":false}],"defaultCity":"Санкт-Петербург","restaurants":[{"id":"zacepskiy","name":"SBW Зацепский вал","address":"ул. Зацепский вал, д. 4, стр. 2","city":"Москва","hours":"Круглосуточно","coordinates":{"latitude":55.733077,"longitude":37.640014},"twoGisFirmId":"70000001041306916","sourceUrl":"https://sbw.ru/","orderingEnabled":true},{"id":"ryabinovaya","name":"SBW Рябиновая","address":"ул. Рябиновая, д. 59","city":"Москва","hours":"09:30–22:30","coordinates":{"latitude":55.686193,"longitude":37.430631},"twoGisFirmId":"4504127915546320","sourceUrl":"https://sbw.ru/","orderingEnabled":true},{"id":"sokolniki","name":"SBW Сокольники","address":"пл. Сокольническая, д. 9А","city":"Москва","hours":"10:00–21:00","coordinates":{"latitude":55.790403,"longitude":37.679932},"twoGisFirmId":"70000001007158261","sourceUrl":"https://sbw.ru/","orderingEnabled":true},{"id":"spb-ligovskiy-30","name":"SBW Галерея","address":"Лиговский пр., д. 30, лит. А","city":"Санкт-Петербург","hours":"Пн–Вс 10:00–23:00","coordinates":{"latitude":59.92691,"longitude":30.361093},"twoGisFirmId":"70000001112400282","sourceUrl":"https://sbw.ru/","orderingEnabled":true},{"id":"spb-pestelya-23","name":"SBW Пестеля","address":"ул. Пестеля, д. 23","city":"Санкт-Петербург","hours":"Круглосуточно","coordinates":{"latitude":59.942685,"longitude":30.347042},"twoGisFirmId":"5348553838630574","sourceUrl":"https://sbw.ru/","orderingEnabled":true},{"id":"spb-moskovskiy-109","name":"SBW Московский","address":"Московский пр., д. 109, лит. А, пом. 4-Н","city":"Санкт-Петербург","hours":"Пн–Пт 08:00–22:00; Сб 09:00–22:00; Вс 09:00–21:00","coordinates":{"latitude":59.889849,"longitude":30.318875},"twoGisFirmId":"70000001033466467","sourceUrl":"https://sbw.ru/","orderingEnabled":true},{"id":"spb-sampsonievskiy-62","name":"SBW Большой Сампсониевский","address":"Большой Сампсониевский пр., д. 62","city":"Санкт-Петербург","hours":"Пн–Пт 08:00–22:00; Сб–Вс 10:00–22:00","coordinates":{"latitude":59.975559,"longitude":30.338554},"twoGisFirmId":"5348553838928347","sourceUrl":"https://sbw.ru/","orderingEnabled":true}],"breads":["Белый","Зерновой","С пармезаном и орегано","С кунжутом","Серый","Кукурузный","Сырный"],"sauces":["Чесночный ранч","Сырный","Медовая горчица","Гриль","Сметанный","Кетчуп","Горчица острая","Барбекю","Чипотл Саусвест","Тысяча островов","Майонез лёгкий","Сладкий лук"],"vegetables":["Айсберг","Томаты","Огурцы","Красный лук","Сладкий перец","Оливки","Халапеньо","Маринованные огурцы"],"seasonings":["Соль","Чёрный перец","Оливковое масло","Винный уксус"],"extras":[{"id":"cheese","name":"Дополнительный сыр","price":40},{"id":"bacon","name":"Бекон","price":60}]},"paymentMethods":{"cards":[]}};

  var BOOTSTRAP = FIXTURES.bootstrap;
  // Продуктовые картинки в каталоге заданы абсолютным путём /brand/...;
  // внутри iframe приложение живёт по подпути, поэтому переписываем на относительный.
  BOOTSTRAP.products.forEach(function (product) {
    if (typeof product.image === "string")
      product.image = product.image.replace(/^\/brand\//, "./brand/");
  });

  var STAFF_TTL = 12 * 60 * 60 * 1000; // как на сервере: 12 часов
  var state = {
    nextOrderNumber: 1, // серверный AUTOINCREMENT orders.number
    orders: new Map(), // id -> order
    idempotency: new Map(), // customerId + "\u0000" + key -> { input, order }
    customers: new Map(), // token -> customer
    staff: new Map(), // token -> { role, expiresAt }
  };
  var callLog = [];

  function uuid() {
    if (window.crypto && typeof window.crypto.randomUUID === "function")
      return window.crypto.randomUUID();
    // Подстраховка для старых окружений без randomUUID.
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (ch) {
        var rand = (Math.random() * 16) | 0;
        return (ch === "x" ? rand : (rand & 0x3) | 0x8).toString(16);
      },
    );
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function json(payload, status) {
    return new Response(JSON.stringify(payload), {
      status: status || 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Ошибки в форме ApiError сервера: { error: message } + HTTP-статус.
  function apiError(status, message) {
    return { status: status, message: message };
  }

  function header(init, name) {
    var raw = init && init.headers;
    if (!raw) return null;
    if (typeof raw.get === "function") return raw.get(name);
    if (Array.isArray(raw)) {
      var found = null;
      raw.forEach(function (entry) {
        if (entry && entry[0] === name) found = entry[1];
      });
      return found;
    }
    return raw[name] != null ? String(raw[name]) : null;
  }

  function parseBody(init) {
    var text = init && typeof init.body === "string" ? init.body : "";
    if (!text) return {};
    try {
      return JSON.parse(text);
    } catch {
      throw apiError(400, "Некорректный JSON");
    }
  }

  // Сессии: как на сервере, токен создаёт POST /api/session. Упрощение демо:
  // неизвестный токен (например, сохранённый в localStorage с прошлой загрузки)
  // получает новую пустую учётную запись вместо 401, чтобы демо не ломалось
  // после перезагрузки страницы.
  function customer(init) {
    var token = header(init, "x-session-token");
    if (!token) throw apiError(401, "Нужна действующая сессия");
    var existing = state.customers.get(token);
    if (existing) return existing;
    var created = {
      id: uuid(),
      name: "Гость SBW",
      points: 120, // стартовый баланс демо-сервера
      orders: [],
      ledger: [],
    };
    state.customers.set(token, created);
    return created;
  }

  function findProduct(id) {
    for (var i = 0; i < BOOTSTRAP.products.length; i++)
      if (BOOTSTRAP.products[i].id === id) return BOOTSTRAP.products[i];
    return null;
  }

  function findRestaurant(id) {
    for (var i = 0; i < BOOTSTRAP.restaurants.length; i++)
      if (BOOTSTRAP.restaurants[i].id === id) return BOOTSTRAP.restaurants[i];
    return null;
  }

  function unique(values) {
    return new Set(values).size === values.length;
  }

  // Перенос server/app.ts calculate(): состав строки, скидка SAB10, бонусные баллы.
  function calculate(input, balance) {
    var restaurant = findRestaurant(input.restaurantId);
    if (!restaurant) throw apiError(400, "Ресторан не найден");
    if (restaurant.orderingEnabled === false)
      throw apiError(
        409,
        "Этот ресторан временно не принимает заказы. Выбери другой.",
      );
    var promo = String(input.promoCode == null ? "" : input.promoCode)
      .trim()
      .toUpperCase();
    if (promo !== "" && promo !== "SAB10")
      throw apiError(400, "Промокод не найден");
    var lines = (input.items || []).map(function (item) {
      var product = findProduct(item.productId);
      if (!product) throw apiError(400, "Продукт не найден");
      var sauces =
        item.sauces != null
          ? item.sauces
          : item.sauce
            ? [item.sauce]
            : [];
      if (product.category === "sandwiches") {
        if (item.size === "standard" || BOOTSTRAP.breads.indexOf(item.bread) < 0)
          throw apiError(400, "Выберите размер и хлеб для саба");
      } else if (item.size !== "standard" || item.bread !== "") {
        throw apiError(
          400,
          "Этот продукт не имеет размера саба или выбора хлеба",
        );
      }
      if (
        item.sauces &&
        item.sauce !== (item.sauces.length ? item.sauces[0] : "")
      )
        throw apiError(400, "Проверьте выбранные соусы");
      if (!unique(sauces)) throw apiError(400, "Соусы не должны повторяться");
      var seasonings = item.seasonings != null ? item.seasonings : [];
      if (
        seasonings.some(function (entry) {
          return BOOTSTRAP.seasonings.indexOf(entry) < 0;
        }) ||
        !unique(seasonings)
      )
        throw apiError(400, "Выберите приправы из меню без повторов");
      var preparation =
        seasonings.length > 0 ||
        item.toasting === "extra" ||
        item.toasting === "none" ||
        item.cutInHalf === true;
      if (product.closedRecipe) {
        if (sauces.length || item.vegetables.length || item.extras.length || preparation)
          throw apiError(
            400,
            "«" +
              product.name +
              "» готовится по фиксированному рецепту. Открой «Изменить» в корзине и подтверди состав.",
          );
      } else if (product.customizable) {
        if (
          sauces.some(function (sauce) {
            return BOOTSTRAP.sauces.indexOf(sauce) < 0;
          })
        )
          throw apiError(400, "Выберите соус из меню");
        if (
          item.vegetables.some(function (vegetable) {
            return BOOTSTRAP.vegetables.indexOf(vegetable) < 0;
          })
        )
          throw apiError(400, "Овощ не найден в меню");
        if (!unique(item.vegetables) || !unique(item.extras))
          throw apiError(400, "Добавки и овощи не должны повторяться");
      } else if (
        item.bread !== "" ||
        sauces.length > 0 ||
        item.vegetables.length > 0 ||
        item.extras.length > 0 ||
        preparation
      ) {
        throw apiError(400, "Этот продукт продаётся без изменения состава");
      }
      var extraPrice = item.extras.reduce(function (sum, id) {
        var extra = null;
        for (var i = 0; i < BOOTSTRAP.extras.length; i++)
          if (BOOTSTRAP.extras[i].id === id) extra = BOOTSTRAP.extras[i];
        if (!extra) throw apiError(400, "Добавка не найдена");
        return sum + extra.price;
      }, 0);
      var unitPrice =
        (item.size === "30" ? Math.round(product.price * 1.8) : product.price) +
        extraPrice;
      return {
        productId: product.id,
        name: product.name,
        quantity: item.quantity,
        unitPrice: unitPrice,
        total: unitPrice * item.quantity,
        configuration: [
          item.size === "standard" ? "" : item.size + " см",
          item.bread,
          product.closedRecipe ? "Состав по рецепту" : "",
        ]
          .concat(sauces)
          .concat(seasonings)
          .concat([
            item.toasting === "extra"
              ? "Сильнее подогреть"
              : item.toasting === "none"
                ? "Не поджаривать"
                : "",
            item.cutInHalf ? "Разрезать пополам" : "",
          ])
          .concat(item.vegetables)
          .concat(
            item.extras.map(function (id) {
              for (var i = 0; i < BOOTSTRAP.extras.length; i++)
                if (BOOTSTRAP.extras[i].id === id) return BOOTSTRAP.extras[i].name;
              return undefined;
            }),
          )
          .filter(Boolean)
          .join(" · "),
      };
    });
    var subtotal = lines.reduce(function (sum, line) {
      return sum + line.total;
    }, 0);
    var discount = promo === "SAB10" ? Math.round(subtotal * 0.1) : 0;
    // Баллами можно оплатить до 30% заказа, не больше остатка на счёте.
    var pointsSpent = Math.min(
      input.redeemPoints || 0,
      balance,
      Math.floor((subtotal - discount) * 0.3),
    );
    var total = subtotal - discount - pointsSpent;
    return {
      lines: lines,
      subtotal: subtotal,
      discount: discount,
      pointsSpent: pointsSpent,
      total: total,
      pointsEarned: Math.floor(total * 0.1),
    };
  }

  function ledgerEntry(order, kind, points, reason) {
    if (points === 0) return;
    order.owner.ledger.push({
      id: uuid(),
      orderId: order.id,
      points: points,
      reason: reason,
      createdAt: nowIso(),
    });
    void kind;
  }

  function findOrder(orderId, customerId) {
    var order = state.orders.get(orderId);
    if (!order || (customerId && order.customerId !== customerId))
      throw apiError(404, "Заказ не найден");
    return order;
  }

  function publicOrder(order) {
    var copy = Object.assign({}, order);
    delete copy.owner;
    return copy;
  }

  // Мгновенная тестовая оплата вместо вызова ЮKassa: списываем бонусы и
  // переводим заказ в paid (сервер делает это после подтверждения кассы).
  function applyInstantPayment(order, customerRecord) {
    if (order.status === "cancelled") throw apiError(409, "Заказ отменён");
    if (order.status !== "pending_payment") return order;
    var spent = order.quote.pointsSpent;
    if (customerRecord.points < spent)
      throw apiError(409, "Баланс бонусов изменился. Создайте заказ заново");
    customerRecord.points -= spent;
    ledgerEntry(order, "spend", -spent, "Списание за заказ");
    order.paymentStatus = "paid";
    order.status = "paid";
    order.updatedAt = nowIso();
    return order;
  }

  function requireStaff(init) {
    var token = header(init, "x-staff-token");
    var session = token ? state.staff.get(token) : null;
    if (!token || !session || session.expiresAt <= Date.now()) {
      if (token) state.staff.delete(token);
      throw apiError(401, "Сессия сотрудника завершена. Войди снова.");
    }
    return session;
  }

  var statusTransitions = {
    pending_payment: [],
    paid: ["preparing", "cancelled"],
    preparing: ["ready", "cancelled"],
    ready: ["completed"],
    completed: [],
    cancelled: [],
  };

  function handleApi(pathname, init) {
    var method = ((init && init.method) || "GET").toUpperCase();
    var segments = pathname.replace(/^\/api\/?/, "").split("/").filter(Boolean);
    var resource = segments[0] || "";
    var body = method === "GET" ? {} : parseBody(init);
    callLog.push(method + " " + pathname);

    // GET /api/bootstrap — каталог из фикстуры реального сервера.
    if (method === "GET" && resource === "bootstrap")
      return json(BOOTSTRAP);

    // POST /api/session — как на сервере: новый токен, баланс 120 баллов.
    if (method === "POST" && resource === "session") {
      var token = uuid();
      state.customers.set(token, {
        id: uuid(),
        name: "Гость SBW",
        points: 120,
        orders: [],
        ledger: [],
      });
      return json({ token: token }, 201);
    }

    if (resource === "me" && method === "GET") {
      var me = customer(init);
      return json({
        customer: { id: me.id, name: me.name, points: me.points },
        // publicOrder убирает служебную ссылку owner (иначе JSON циркулярен).
        orders: me.orders
          .slice()
          .sort(function (a, b) {
            return b.number - a.number;
          })
          .map(publicOrder),
        ledger: me.ledger.slice().reverse(),
      });
    }

    if (resource === "quote" && method === "POST") {
      var quoted = customer(init);
      return json(calculate(body, quoted.points));
    }

    if (resource === "orders" && segments.length === 1) {
      if (method === "POST") {
        var owner = customer(init);
        var key = body.idempotencyKey;
        if (typeof key !== "string" || key.length < 8)
          throw apiError(400, "Проверьте состав запроса");
        var idempotencyId = owner.id + "\u0000" + key;
        var replay = state.idempotency.get(idempotencyId);
        if (replay) {
          if (JSON.stringify(replay.input) !== JSON.stringify(body))
            throw apiError(409, "Этот ключ уже использован для другого заказа");
          return json(publicOrder(replay.order), 200);
        }
        var quote = calculate(body, owner.points);
        var restaurant = findRestaurant(body.restaurantId);
        if (!restaurant) throw apiError(400, "Ресторан не найден");
        var id = uuid();
        var createdAt = nowIso();
        var order = {
          id: id,
          number: state.nextOrderNumber++,
          customerId: owner.id,
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          restaurantAddress: restaurant.address,
          status: "pending_payment",
          quote: quote,
          items: body.items,
          createdAt: createdAt,
          updatedAt: createdAt,
          pickupTime: body.pickupTime,
          comment: body.comment,
          paymentStatus: "pending",
          owner: owner,
        };
        state.orders.set(id, order);
        owner.orders.push(order);
        state.idempotency.set(idempotencyId, { input: body, order: order });
        return json(publicOrder(order), 201);
      }
    }

    // POST /api/orders/:id/pay — локальный демо-эквайринг (outcome success/declined).
    if (resource === "orders" && segments[2] === "pay" && method === "POST") {
      var payer = customer(init);
      var payOrder = findOrder(segments[1], payer.id);
      if (payOrder.status === "cancelled") throw apiError(409, "Заказ отменён");
      if (payOrder.status !== "pending_payment")
        return json(publicOrder(payOrder));
      if (body.outcome === "declined") {
        payOrder.paymentStatus = "declined";
        payOrder.updatedAt = nowIso();
        return json(publicOrder(payOrder));
      }
      applyInstantPayment(payOrder, payer);
      return json(publicOrder(payOrder));
    }

    // Оплата заказа. Сервер ходит в ЮKassa; демо проходит мгновенно как
    // тестовая — confirmationUrl всегда null, поэтому интерфейс сразу
    // показывает «Оплачено», реальные вызовы кассы невозможны.
    if (resource === "orders" && segments[2] === "payment") {
      var synced = customer(init);
      var paidOrder = findOrder(segments[1], synced.id);
      if (method === "GET") return json({ order: publicOrder(paidOrder), confirmationUrl: null });
      if (method === "POST") {
        if (paidOrder.status !== "pending_payment")
          throw apiError(409, "Заказ больше не ожидает оплаты");
        applyInstantPayment(paidOrder, synced);
        return json({ order: publicOrder(paidOrder), confirmationUrl: null });
      }
    }

    // Сохранённые карты: без кассы привязка недоступна (на сервере 503,
    // когда gateway не настроен). Пустой список — штатный ответ.
    if (resource === "payment-methods") {
      if (method === "GET") {
        customer(init);
        return json(FIXTURES.paymentMethods);
      }
      throw apiError(503, "Касса ещё не настроена");
    }

    if (resource === "staff") {
      var action = segments[1] || "";
      if (action === "login" && method === "POST") {
        // Единственный демо-код со стороны клиента: SBW-DEMO (роль staff).
        // Административный код в встраиваемую демо-сборку не выносится.
        if (body.code !== "SBW-DEMO")
          throw apiError(401, "Неверный код доступа");
        var staffToken = uuid();
        var expiresAt = Date.now() + STAFF_TTL;
        state.staff.set(staffToken, { role: "staff", expiresAt: expiresAt });
        return json({ token: staffToken, role: "staff", expiresAt: expiresAt });
      }
      if (action === "logout" && method === "POST") {
        var logoutToken = header(init, "x-staff-token");
        if (logoutToken) state.staff.delete(logoutToken);
        return json({ ok: true });
      }
      if (action === "me" && method === "GET") {
        var session = requireStaff(init);
        return json({ role: session.role, expiresAt: session.expiresAt });
      }
      if (action === "orders" && segments.length === 1 && method === "GET") {
        requireStaff(init);
        var all = Array.from(state.orders.values()).sort(function (a, b) {
          return b.number - a.number;
        });
        return json(all.map(publicOrder));
      }
      if (action === "orders" && segments.length === 3 && method === "PATCH") {
        requireStaff(init);
        var changed = findOrder(segments[2]);
        var nextStatus = body.status;
        if (changed.status === nextStatus) return json(publicOrder(changed));
        if (!(statusTransitions[changed.status] || []).includes(nextStatus))
          throw apiError(409, "Этот переход статуса запрещён");
        if (nextStatus === "completed") {
          changed.owner.points += changed.quote.pointsEarned;
          ledgerEntry(changed, "earn", changed.quote.pointsEarned, "Бонусы за выданный заказ");
        }
        if (nextStatus === "cancelled") {
          changed.owner.points += changed.quote.pointsSpent;
          ledgerEntry(changed, "refund", changed.quote.pointsSpent, "Возврат бонусов при отмене");
          changed.paymentStatus = "refunded";
        }
        changed.status = nextStatus;
        changed.updatedAt = nowIso();
        return json(publicOrder(changed));
      }
    }

    if (resource === "admin") {
      // Ресторанный администратор в демо-сборке недоступен: код admin не
      // встраивается, поэтому любой запрос к /api/admin/* отклоняется.
      var adminSession = requireStaff(init);
      if (adminSession.role !== "admin")
        throw apiError(403, "Управление ресторанами доступно администратору");
      throw apiError(404, "Маршрут не найден");
    }

    // Непокрытый путь: осмысленная заглушка в форме сервера + предупреждение.
    console.warn(
      "[SBW demo] Нет реализации для " + method + " /api/" + segments.join("/"),
    );
    return json({ error: "Маршрут API не найден" }, 404);
  }

  var nativeFetch = window.fetch ? window.fetch.bind(window) : null;
  window.fetch = function (input, init) {
    var rawUrl =
      typeof input === "string" ? input : input && input.url ? input.url : "";
    var pathname = null;
    try {
      pathname = new URL(rawUrl, window.location.href).pathname;
    } catch {
      pathname = null;
    }
    if (pathname === "/api" || (pathname && pathname.indexOf("/api/") === 0)) {
      var effectiveInit = init || {
        method: typeof input === "object" && input ? input.method || "GET" : "GET",
        headers: typeof input === "object" && input ? input.headers : undefined,
        body: undefined,
      };
      try {
        var response = handleApi(pathname, effectiveInit);
        return Promise.resolve(response);
      } catch (error) {
        if (error && error.status)
          return Promise.resolve(json({ error: error.message }, error.status));
        console.warn("[SBW demo] Ошибка обработки запроса:", error);
        return Promise.resolve(
          json({ error: "Не удалось выполнить запрос" }, 500),
        );
      }
    }
    if (!nativeFetch) return Promise.reject(new Error("fetch недоступен"));
    return nativeFetch(input, init);
  };

  // Экран телефона: без видимых скроллбаров, прокрутка не цепляется за страницу
  var phoneStyle = document.createElement("style");
  phoneStyle.textContent =
    "html,body{scrollbar-width:none;overscroll-behavior:contain}" +
    "::-webkit-scrollbar{width:0;height:0;display:none}";
  document.head.appendChild(phoneStyle);

  // Диагностика: список перехваченных вызовов для проверочных скриптов.
  window.__SBW_DEMO_DEBUG__ = { calls: callLog };
})();
