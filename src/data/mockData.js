export const mockCategories = [
  { id: 1, slug: 'mode', name: 'Mode', color: '#B89B72', article_count: 4 },
  { id: 2, slug: 'skonhet', name: 'Skönhet', color: '#E8A0A0', article_count: 4 },
  { id: 3, slug: 'halsa', name: 'Hälsa', color: '#8FBC8F', article_count: 3 },
  { id: 4, slug: 'hem-inredning', name: 'Hem & Inredning', color: '#8B7355', article_count: 3 },
  { id: 5, slug: 'mat-dryck', name: 'Mat & Dryck', color: '#CD853F', article_count: 2 },
  { id: 6, slug: 'resor', name: 'Resor', color: '#4682B4', article_count: 3 },
];

export const mockArticles = [
  {
    id: 1,
    slug: 'sommarens-hetaste-modetrender-2024',
    title: 'Sommarens hetaste modetrender 2024',
    excerpt: 'Från pastelltoner till djärva mönster – vi har samlat säsongens viktigaste trender som du inte vill missa.',
    content: `<p>Sommaren 2024 bjuder på ett härligt färgspel och spännande silhuetter. Årets hetaste trender blandar nostalgi med modernitet på ett sätt som känns både fräscht och tillgängligt.</p>
<h2>Pastell dominerar</h2>
<p>Mjuka pastelltoner i lila, mintgrönt och babyrosa syns överallt den här säsongen. Kombinera gärna ett par plagg i liknande nyanser för ett sofistikerat monokromt uttryck.</p>
<h2>Lager på lager</h2>
<p>Lagertänkandet lever kvar – kombinera lättare plagg och skapa spännande kontraster. En transparent blus ovanpå ett simpelt linne ger omedelbart en intressant look.</p>
<h2>Cutout-detaljer</h2>
<p>Strategiska cutout-detaljer på klänningar och topar fortsätter att dominera. Det ger ett modernt och lekfullt uttryck utan att bli för utmanande.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&auto=format&fit=crop',
    category_name: 'Mode',
    category_slug: 'mode',
    category_color: '#B89B72',
    author_name: 'Sofia Lindqvist',
    read_time: 5,
    views: 3421,
    published_at: '2024-06-10T09:00:00Z',
    tags: '["mode","sommar","trender","2024"]',
    featured: true,
    status: 'published',
  },
  {
    id: 2,
    slug: 'tio-skonhetstips-strålande-sommarhy',
    title: '10 skönhetstips för en strålande sommarhy',
    excerpt: 'Solen och värmen kan vara hårda mot huden. Här är experttipsen för att hålla hyn frisk och glödande hela sommaren.',
    content: `<p>Sommaren är underbar men ställer höga krav på hudvårdsrutinen. Med rätt produkter och vanor kan du njuta av solen utan att huden lider.</p>
<h2>1. Solskydd är A och O</h2>
<p>Applicera solskyddsfaktor 30 eller 50 varje morgon, även molniga dagar. Välj en produkt som passar din hudtyp – oljig, torr eller kombinerad hud.</p>
<h2>2. Drick mer vatten</h2>
<p>Huden behöver hydrering inifrån. Sikta på minst 2 liter vatten om dagen under varma sommardagar.</p>
<h2>3. Lätt foundation</h2>
<p>Byt ut din täckande foundation mot en lättare BB-kräm eller tinted moisturizer som låter huden andas.</p>
<h2>4. Peeling en gång i veckan</h2>
<p>Ta bort döda hudceller med en mild peeling för att hålla hyn slät och strålande.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1400&auto=format&fit=crop',
    category_name: 'Skönhet',
    category_slug: 'skonhet',
    category_color: '#E8A0A0',
    author_name: 'Emma Karlsson',
    read_time: 4,
    views: 2876,
    published_at: '2024-06-08T10:30:00Z',
    tags: '["skönhet","hudvård","sommar","tips"]',
    featured: true,
    status: 'published',
  },
  {
    id: 3,
    slug: 'yoga-for-nyborjare-kom-igang',
    title: 'Yoga för nybörjare: Kom igång med din praktik',
    excerpt: 'Yoga är för alla – oavsett ålder, form eller erfarenhet. Här är guiden som hjälper dig starta din yogaresa.',
    content: `<p>Yoga är en tusenårig tradition som kombinerar rörelse, andning och meditation. Forskning visar att regelbunden yoga förbättrar både fysisk och mental hälsa.</p>
<h2>Vad behöver du?</h2>
<p>Du behöver egentligen inte mer än en yogamatta och bekväma kläder. En stilla plats och 20–30 minuter om dagen räcker för att komma igång.</p>
<h2>Börja med grundpositioner</h2>
<p>Barnpositionen (Balasana), nedåtgående hund (Adho Mukha Svanasana) och bergspose (Tadasana) är perfekta startpunkter för nybörjare.</p>
<h2>Andningens kraft</h2>
<p>Andningen är central i yoga. Öva djupa, jämna andetag och försök synkronisera dem med dina rörelser.</p>
<h2>Var tålmodig</h2>
<p>Yoga är en resa, inte en tävling. Lyssna på din kropp och tvinga aldrig fram positioner som känns obehagliga.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1400&auto=format&fit=crop',
    category_name: 'Hälsa',
    category_slug: 'halsa',
    category_color: '#8FBC8F',
    author_name: 'Maja Bergström',
    read_time: 6,
    views: 4102,
    published_at: '2024-06-05T08:00:00Z',
    tags: '["yoga","hälsa","träning","nybörjare"]',
    featured: true,
    status: 'published',
  },
  {
    id: 4,
    slug: 'inred-balkongen-som-utomhusrum',
    title: 'Inred din balkong som ett utomhusrum',
    excerpt: 'En välplanerad balkong kan bli ditt nya favoritrum. Vi visar hur du förvandlar även den minsta yta till en grön oas.',
    content: `<p>Oavsett om du har en stor terrass eller en liten balkong finns det massor du kan göra för att skapa en inbjudande utomhusmiljö.</p>
<h2>Välj rätt möbler</h2>
<p>Investera i möbler som tål väder och vind. Rotting, teak och aluminium är hållbara material som håller i många år.</p>
<h2>Gröna växter skapar stämning</h2>
<p>Plantera örter, blommor och klätterväxter i krukor. De ger liv och färg till balkongen och det är roligt att odla eget.</p>
<h2>Belysning ger magi</h2>
<p>Ljusslingor och lyktor förvandlar balkongen till en mysig plats även efter solnedgången.</p>
<h2>Privacyskärm</h2>
<p>En bambuskärm eller ett tygsegel skapar en känsla av privatliv och gör balkongen mer intim.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&auto=format&fit=crop',
    category_name: 'Hem & Inredning',
    category_slug: 'hem-inredning',
    category_color: '#8B7355',
    author_name: 'Lena Johansson',
    read_time: 5,
    views: 1987,
    published_at: '2024-06-03T11:00:00Z',
    tags: '["hem","balkong","inredning","trädgård"]',
    featured: true,
    status: 'published',
  },
  {
    id: 5,
    slug: 'sommarens-basta-smoothies',
    title: 'Sommarens bästa smoothies – fräscha och nyttiga recept',
    excerpt: 'Kyl ner dig med dessa fantastiska smoothies som är både goda och fullpackade med vitaminer och mineraler.',
    content: `<p>En kall smoothie är det perfekta sättet att starta morgonen på sommaren. Här är fem recept som är enkla att göra och fantastiskt goda.</p>
<h2>Tropical Sunrise</h2>
<p>Mixa mango, ananas, banan och kokosmjölk. Toppa med chia-frön och lite limejuice för extra fräschör.</p>
<h2>Grön kraft-smoothie</h2>
<p>Spenat, äpple, gurka, ingefära och lite citronjuice. Sötare än den låter – perfekt för dem som vill äta mer grönt.</p>
<h2>Berry Blast</h2>
<p>Frysta blåbär, hallon och jordgubbar med vaniljyoghurt och lite honung. En klassiker som alltid funkar.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&auto=format&fit=crop',
    category_name: 'Mat & Dryck',
    category_slug: 'mat-dryck',
    category_color: '#CD853F',
    author_name: 'Anna Holm',
    read_time: 3,
    views: 2654,
    published_at: '2024-06-01T07:00:00Z',
    tags: '["mat","smoothie","hälsa","recept"]',
    featured: true,
    status: 'published',
  },
  {
    id: 6,
    slug: 'italiens-dolda-parlor',
    title: 'Italiens dolda pärlor: Platser du måste besöka',
    excerpt: 'Bortom Rom och Florens döljer sig underbara byar och stränder som få turister känner till. Vi guidar dig dit.',
    content: `<p>Italien är mer än Rom och Florens. Landet är fyllt av charmiga byar, smaragdgröna sjöar och dramatiska kustlandskap som väntar på att upptäckas.</p>
<h2>Matera – grottstaden</h2>
<p>I södra Italien ligger Matera med sina gamla grottbostäder, sassi. Staden är ett UNESCO-världsarv och ett av Europas mest unika resmål.</p>
<h2>Cinque Terre</h2>
<p>Fem färgglada fiskarbyar klängandes längs klipporna vid Liguriska havet. Vandra längs kustslingan och njut av fantastiska vyer.</p>
<h2>Orvieto</h2>
<p>En medeltida stad högt uppe på en vulkanisk klippa i Umbrien. Katedralen med sin gotiska fasad är en av Italiens vackraste.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1534445867742-43195f401b6c?w=1400&auto=format&fit=crop',
    category_name: 'Resor',
    category_slug: 'resor',
    category_color: '#4682B4',
    author_name: 'Erik Svensson',
    read_time: 7,
    views: 3290,
    published_at: '2024-05-28T09:00:00Z',
    tags: '["resor","italien","europa","tips"]',
    featured: true,
    status: 'published',
  },
  {
    id: 7,
    slug: 'hostens-nyckelplagg-2024',
    title: 'Höstens nyckelplagg 2024 – investera rätt',
    excerpt: 'Bygg en kapselgarderob för hösten med dessa tidlösa nyckelplagg som håller säsong efter säsong.',
    content: `<p>Hösten är den perfekta årstiden för mode. Lagom temperatur för att visa upp kläder, och en rik färgpalett att inspireras av.</p>
<h2>Den perfekta trenchcoaten</h2>
<p>En klassisk beige trenchcoat är ett klokt köp. Den lyfter varje outfit och håller i decennier med rätt skötsel.</p>
<h2>Vidbyxor i ull</h2>
<p>Vidbyxor med pressad kant i ylletyg är en av höstens viktigaste silhuetter. Välj neutral färg – grå, beige eller brun.</p>
<h2>Chunky boots</h2>
<p>Robusta boots med tjock sula är både praktiska och snygga. De lyfter enkla vardagslookar direkt.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&auto=format&fit=crop',
    category_name: 'Mode',
    category_slug: 'mode',
    category_color: '#B89B72',
    author_name: 'Sofia Lindqvist',
    read_time: 4,
    views: 1543,
    published_at: '2024-05-20T10:00:00Z',
    tags: '["mode","höst","kapselgarderob"]',
    featured: false,
    status: 'published',
  },
  {
    id: 8,
    slug: 'naturliga-ingredienser-hudvard',
    title: 'Naturliga ingredienser för din hudvårdsrutin',
    excerpt: 'Köket är fullt av ingredienser som är fantastiska för huden. Här är de bästa naturliga alternativen till dyra produkter.',
    content: `<p>Naturliga ingredienser har använts för hudvård i tusentals år med god anledning – många av dem är verkligen effektiva och utan skadliga tillsatser.</p>
<h2>Honung</h2>
<p>Rå honung är antibakteriell och återfuktande. Perfekt som mask för torr eller känslig hud – låt sitta 15 minuter sedan skölj av.</p>
<h2>Kokosolja</h2>
<p>Kokosolja är en utmärkt fuktgivare för kroppen och håret. Var försiktig med att använda den i ansiktet om du har oljig hy.</p>
<h2>Gurka</h2>
<p>Kylda gurkskivor på ögonen minskar svullnad och ger en omedelbar uppfräschande känsla.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=1200&auto=format&fit=crop',
    category_name: 'Skönhet',
    category_slug: 'skonhet',
    category_color: '#E8A0A0',
    author_name: 'Emma Karlsson',
    read_time: 5,
    views: 1876,
    published_at: '2024-05-18T11:00:00Z',
    tags: '["skönhet","naturlig","hudvård","DIY"]',
    featured: false,
    status: 'published',
  },
  {
    id: 9,
    slug: 'fem-vanor-battre-somn',
    title: '5 vanor för bättre sömn – vetenskapligt bevisade',
    excerpt: 'God sömn är grundstenen för hälsa och välmående. Dessa fem enkla vanor kan förbättra din sömnkvalitet dramatiskt.',
    content: `<p>Sömnbrist är ett utbrett problem i moderna samhällen. Forskning visar att kronisk sömnbrist ökar risken för en rad sjukdomar och försämrar kognitiv förmåga.</p>
<h2>1. Håll regelbundna sovtider</h2>
<p>Gå och lägg dig och vakna på samma tid varje dag – även på helger. Det stärker din cirkadiska rytm.</p>
<h2>2. Undvik skärmar 1 timme före läggdags</h2>
<p>Blått ljus från skärmar hämmar melatoninproduktionen. Läs en bok eller lyssna på lugn musik istället.</p>
<h2>3. Håll sovrummet svalt</h2>
<p>Den optimala sovrumstemperaturen är 16–19 grader Celsius. En sval miljö signalerar till kroppen att det är dags att sova.</p>
<h2>4. Undvik koffein efter 14:00</h2>
<p>Koffein har en halveringstid på 5–6 timmar. En kopp kaffe klockan 15 kan alltså fortfarande påverka din sömn vid midnatt.</p>
<h2>5. Rör på dig regelbundet</h2>
<p>Fysisk aktivitet förbättrar sömnkvaliteten, men undvik intensiv träning de sista timmarna innan läggdags.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&auto=format&fit=crop',
    category_name: 'Hälsa',
    category_slug: 'halsa',
    category_color: '#8FBC8F',
    author_name: 'Maja Bergström',
    read_time: 6,
    views: 2987,
    published_at: '2024-05-15T08:30:00Z',
    tags: '["hälsa","sömn","välmående","vanor"]',
    featured: false,
    status: 'published',
  },
  {
    id: 10,
    slug: 'minimalistisk-inredning-mindre-ar-mer',
    title: 'Minimalistisk inredning: Mindre är mer',
    excerpt: 'Minimalismen handlar inte om tomma rum – det handlar om att välja det som verkligen betyder något. Lär dig principerna.',
    content: `<p>Minimalistisk inredning har vuxit sig stark som motrörelsent mot överkonsumtion. Konceptet är enkelt: behåll bara det som fyller en funktion eller ger glädje.</p>
<h2>Börja med att rensa</h2>
<p>Gå igenom ett rum i taget och ställ dig frågan: "Fyller detta en funktion eller ger det mig glädje?" Om svaret är nej, är det dags att låta det gå.</p>
<h2>Neutral färgpalett</h2>
<p>Välj vit, beige, grå och naturliga träfärger som bas. Det skapar lugn och gör rummet luftigare.</p>
<h2>Kvalitet över kvantitet</h2>
<p>Investera i färre men bättre möbler. Ett välgjort soffa i neutralt tyg håller i decennier och ser alltid bra ut.</p>
<h2>Tomrum är okej</h2>
<p>Låt väggarna vara relativt tomma. Negativt utrymme är en del av designen och bidrar till rummets lugn.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1200&auto=format&fit=crop',
    category_name: 'Hem & Inredning',
    category_slug: 'hem-inredning',
    category_color: '#8B7355',
    author_name: 'Lena Johansson',
    read_time: 5,
    views: 1654,
    published_at: '2024-05-12T09:00:00Z',
    tags: '["hem","minimalism","inredning","design"]',
    featured: false,
    status: 'published',
  },
  {
    id: 11,
    slug: 'en-vecka-i-tokyo',
    title: 'En vecka i Tokyo – komplett reseguide',
    excerpt: 'Tokyo är en stad av kontraster där tradition möter framtid. Här är din kompletta guide för sju magiska dagar.',
    content: `<p>Tokyo är en av världens mest fascinerande städer. Metropolen erbjuder allt från antika tempel till neonbelysta shoppinggator, all rymdigt packad i en pulserande storstad.</p>
<h2>Dag 1–2: Tradition och historia</h2>
<p>Börja med Senso-ji templet i Asakusa, besök Meiji-skogen och avsluta med en promenad längs Harajuku med sina excentriska modeboutiques.</p>
<h2>Dag 3–4: Modern Tokyo</h2>
<p>Shibuya korsningen, Shinjuku på natten och den elektronikfyllda Akihabara. Ta också en tur upp i Tokyo Skytree för panoramautsikt.</p>
<h2>Dag 5: Dagsutflykt till Nikko</h2>
<p>Nikko med sina praktfulla shintotempel och vattenfall är ett perfekt utflyktsmål, bara 2 timmar med tåg från Tokyo.</p>
<h2>Mat i Tokyo</h2>
<p>Ät på små lokala ramen-ställen, prova takoyaki på gatan och boka ett bord på ett michelin-restaurang – Tokyo har fler Michelin-stjärnor än någon annan stad i världen.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&auto=format&fit=crop',
    category_name: 'Resor',
    category_slug: 'resor',
    category_color: '#4682B4',
    author_name: 'Erik Svensson',
    read_time: 8,
    views: 3102,
    published_at: '2024-05-10T10:00:00Z',
    tags: '["resor","tokyo","japan","guide"]',
    featured: false,
    status: 'published',
  },
  {
    id: 12,
    slug: 'hallbart-mode-shoppa-medvetet',
    title: 'Hållbart mode: Så shoppar du mer medvetet',
    excerpt: 'Modeindustrin är en av världens mest förorenande. Men det finns sätt att klä sig med stil och gott samvete.',
    content: `<p>Fast fashion har tagit sin toll på miljön. Men intresset för hållbart mode växer och det finns fler och fler alternativ för den medvetna konsumenten.</p>
<h2>Köp begagnat</h2>
<p>Second hand-shopping har aldrig varit trendiga. Vintagebutiker, loppisar och appar som Vinted erbjuder fantastiska fynd till en bråkdel av nypriset.</p>
<h2>Välj hållbara material</h2>
<p>Organisk bomull, lyocell (Tencel), lin och återvunnen polyester är miljövänligare alternativ till konventionella material.</p>
<h2>Investera i kvalitet</h2>
<p>Köp färre men bättre plagg. Ett välgjort klädesplagg som håller i tio år är mycket mer hållbart än tio billiga plagg som håller ett år.</p>
<h2>Byt och laga</h2>
<p>Organisera bytardagar med vänner och lär dig grundläggande sömnadskunskaper för att förlänga plaggens livslängd.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&auto=format&fit=crop',
    category_name: 'Mode',
    category_slug: 'mode',
    category_color: '#B89B72',
    author_name: 'Sofia Lindqvist',
    read_time: 5,
    views: 2134,
    published_at: '2024-05-08T09:30:00Z',
    tags: '["mode","hållbarhet","miljö","tips"]',
    featured: false,
    status: 'published',
  },
  {
    id: 13,
    slug: 'harvard-for-friska-lockar',
    title: 'Hårvård för friska och glansiga lockar',
    excerpt: 'Lockar kräver extra kärlek och rätt produkter. Här är rutinen som gör dina lockar till din stolthet.',
    content: `<p>Lockigt hår är vackert men ofta missförstått. Med rätt rutin och produkter kan dina lockar bli din allra vackraste tillgång.</p>
<h2>Schamponera rätt</h2>
<p>Lockar behöver inte tvättas varje dag. Tre gånger i veckan räcker för de flesta. Välj sulfatfritt schampo som inte torkar ut håret.</p>
<h2>Balsam är ditt bästa verktyg</html>
<p>Använd generöst med balsam och låt det verka i minst 5 minuter. "Co-washing" – att bara använda balsam utan schampo – fungerar bra för många lockhåringar.</p>
<h2>Definiera lockarna rätt</h2>
<p>Applicera leave-in conditioner och lockkräm på vått hår. Kläm försiktigt – "scrunch" – för att definiera lockarna utan att skada dem.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop',
    category_name: 'Skönhet',
    category_slug: 'skonhet',
    category_color: '#E8A0A0',
    author_name: 'Emma Karlsson',
    read_time: 4,
    views: 1432,
    published_at: '2024-05-05T11:00:00Z',
    tags: '["skönhet","hår","lockar","tips"]',
    featured: false,
    status: 'published',
  },
  {
    id: 14,
    slug: 'vegetarisk-matlagning-hela-veckan',
    title: 'Vegetarisk matlagning för hela veckan',
    excerpt: 'Att äta mer vegetariskt behöver varken vara tråkigt eller komplicerat. Här är en veckas middagsplanering som imponerar.',
    content: `<p>Vegetarisk mat är inte bara bra för miljön – det är också fantastiskt gott och varierat när man väl lär sig tekniken.</p>
<h2>Måndag: Röd linssoppa</h2>
<p>Röda linser med kokosmjölk, ingefära, vitlök och curry. Servera med naanbröd och naturell yoghurt.</p>
<h2>Tisdag: Halloumigryta</h2>
<p>Grillad halloumi i tomatsås med kikärtor och spenat. Klassisk medelhavsmak på 30 minuter.</p>
<h2>Onsdag: Buddha bowl</h2>
<p>Quinoa, rostade grönsaker, avokado, edamame och tahindressing. Färgglad och mättande.</p>
<h2>Torsdag: Pasta med pesto och rostade tomater</h2>
<p>Enkel och snabb vardagsklassiker som hela familjen älskar.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200&auto=format&fit=crop',
    category_name: 'Mat & Dryck',
    category_slug: 'mat-dryck',
    category_color: '#CD853F',
    author_name: 'Anna Holm',
    read_time: 6,
    views: 1876,
    published_at: '2024-05-02T08:00:00Z',
    tags: '["mat","vegetariskt","recept","hälsosamt"]',
    featured: false,
    status: 'published',
  },
  {
    id: 15,
    slug: 'lopning-som-meditation',
    title: 'Löpning som meditation – hitta lugnet i rörelsen',
    excerpt: 'Löpning handlar inte bara om kondition. För många är det en form av rörlig meditation som ger mental klarhet.',
    content: `<p>Mindful löpning är en växande trend där fokus inte ligger på tid eller distans utan på närvaro och upplevelse.</p>
<h2>Lägg undan musiken</h2>
<p>Prova att springa utan hörlurar ibland. Lyssna på din andning, dina steg och omgivningens ljud. Det är en annorlunda och berikande upplevelse.</p>
<h2>Fokusera på andningen</h2>
<p>Synkronisera din andning med dina steg. En vanlig rytm är att andas in på 3 steg och ut på 2 steg.</p>
<h2>Naturmiljöer är extra effektiva</h2>
<p>Forskning visar att löpning i naturen ger starkare stressreducerande effekter än löpning i stadsmiljö. Sök dig ut i skogen när du kan.</p>
<h2>Sätt ingen press</h2>
<p>Lämna klockan hemma ibland. Låt kroppen bestämma tempot och distansen. Det är befriande och ger lust att fortsätta.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1200&auto=format&fit=crop',
    category_name: 'Hälsa',
    category_slug: 'halsa',
    category_color: '#8FBC8F',
    author_name: 'Maja Bergström',
    read_time: 5,
    views: 2234,
    published_at: '2024-04-28T09:00:00Z',
    tags: '["hälsa","löpning","mindfulness","meditation"]',
    featured: false,
    status: 'published',
  },
  {
    id: 16,
    slug: 'skapa-en-mysig-lashorna',
    title: 'Skapa en mysig läshörna hemma',
    excerpt: 'En dedikerad plats för läsning förbättrar läsvanorna dramatiskt. Här är hur du skapar den perfekta läshörnan.',
    content: `<p>En läshörna behöver inte vara ett eget rum – ett välplanerat hörn räcker för att skapa en fridfull plats att fly till med en god bok.</p>
<h2>Välj rätt plats</h2>
<p>Helst vid ett fönster för naturligt ljus, men ett mörkt hörn med rätt belysning fungerar lika bra.</p>
<h2>Bekväm sits är avgörande</h2>
<p>En mjuk fåtölj eller en stor kudde på golvet – välj det som du faktiskt tycker om att sitta i. Lägg till en fotpall för extra komfort.</p>
<h2>Bra belysning</h2>
<p>En justerbar golvlampa eller bordslampa som lyser direkt på boken utan att blända är perfekt. Undvik skarpt takljus.</p>
<h2>Personliga detaljer</h2>
<p>En liten sidotabell för te, en växt och kanske en stapel favorit-böcker gör hörnan till din.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&auto=format&fit=crop',
    category_name: 'Hem & Inredning',
    category_slug: 'hem-inredning',
    category_color: '#8B7355',
    author_name: 'Lena Johansson',
    read_time: 4,
    views: 1234,
    published_at: '2024-04-25T10:00:00Z',
    tags: '["hem","inredning","läsning","mysigt"]',
    featured: false,
    status: 'published',
  },
  {
    id: 17,
    slug: 'marocko-pa-budget',
    title: 'Marocko på budget – tips för den klipska resenären',
    excerpt: 'Marocko är ett av världens mest fascinerande resmål och behöver inte kosta skjortan. Här är hur du gör det billigt.',
    content: `<p>Marocko erbjuder en magisk blandning av berberkulturer, arabisk arkitektur och fantastiska landskap – och allt till priser som är överkomliga för de flesta.</p>
<h2>Billig transport</h2>
<p>CTM-bussar kör mellan alla större städer till bråkdelen av taxipriset. Boka i förväg under högsäsong.</p>
<h2>Ät på medinen</h2>
<p>Tagine och couscous på lokala resturanger i medinen (gamla stan) kostar en tiondel av turistrestaurangerna. Välj ställen där lokalbefolkningen äter.</p>
<h2>Pruta alltid</h2>
<p>Pruta är en del av kulturen på marknader och souker. Börja på hälften av utropspriset och möts i mitten.</p>
<h2>Boende</h2>
<p>Riads (traditionella hus med innergård) är charmiga och ofta billigare än hotell. Boka via Airbnb för bästa pris.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1200&auto=format&fit=crop',
    category_name: 'Resor',
    category_slug: 'resor',
    category_color: '#4682B4',
    author_name: 'Erik Svensson',
    read_time: 6,
    views: 2567,
    published_at: '2024-04-20T09:00:00Z',
    tags: '["resor","marocko","budget","tips"]',
    featured: false,
    status: 'published',
  },
  {
    id: 18,
    slug: 'den-perfekta-roda-lappen',
    title: 'Den perfekta röda läppen – hitta din nyans',
    excerpt: 'Röda läppar är tidlösa och utstrålar självförtroende. Men hur hittar du rätt nyans för just din hudton?',
    content: `<p>En röd läppstift kan vara transformativ, men rätt nyans gör hela skillnaden. Här är guiden för att hitta din perfekta röda.</p>
<h2>Kalla hudtoner</h2>
<p>Välj blålila röda – "berry red" eller "raspberry red". Dessa nyanserna framhäver den kyliga undertonens naturliga lyster.</p>
<h2>Varma hudtoner</h2>
<p>Orange-röda och kopparröda nyanser smälter ihop med varma skintones på ett fantastiskt sätt. Coral-röda är ett tryggt val.</p>
<h2>Neutral hudton</h2>
<p>Du har tur – de flesta röda nyanser fungerar. Prova dig fram och hitta den som ger dig mest självförtroende.</p>
<h2>Appliceringstips</h2>
<p>Använd en läppliner för precision, fyll sedan i med läppstiftet. Tryck lite löst puder mot läpparna med en vävnad för längre hållbarhet.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1599839575338-95c6d4e1c1f7?w=1200&auto=format&fit=crop',
    category_name: 'Skönhet',
    category_slug: 'skonhet',
    category_color: '#E8A0A0',
    author_name: 'Emma Karlsson',
    read_time: 4,
    views: 1789,
    published_at: '2024-04-15T10:00:00Z',
    tags: '["skönhet","makeup","läppar","tips"]',
    featured: false,
    status: 'published',
  },
];
