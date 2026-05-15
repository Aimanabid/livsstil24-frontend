// ─── Mock data for Livsstil24 ────────────────────────────────────────────────

export const MOCK_USER = {
  id: 'acac0c9c22c08924',
  email: 'admin@livsstil24.se',
  name: 'Admin',
  role: 'admin',
  avatar: null,
};

// ── Categories ────────────────────────────────────────────────────────────────
export const MOCK_CATEGORIES = [
  { id: 'cat0000000000001', name: 'Hälsa',   slug: 'halsa',   color: '#6BAE75', icon: '🌿', sort_order: 1, article_count: 5 },
  { id: 'cat0000000000002', name: 'Mode',    slug: 'mode',    color: '#C9A96E', icon: '👗', sort_order: 2, article_count: 4 },
  { id: 'cat0000000000003', name: 'Mat',     slug: 'mat',     color: '#E07A5F', icon: '🍽️', sort_order: 3, article_count: 4 },
  { id: 'cat0000000000004', name: 'Resor',   slug: 'resor',   color: '#3D405B', icon: '✈️', sort_order: 4, article_count: 4 },
  { id: 'cat0000000000005', name: 'Hem',     slug: 'hem',     color: '#81B29A', icon: '🏡', sort_order: 5, article_count: 3 },
  { id: 'cat0000000000006', name: 'Skönhet', slug: 'skonhet', color: '#D4A0A0', icon: '💄', sort_order: 6, article_count: 3 },
];

// ── Articles ──────────────────────────────────────────────────────────────────
const now = new Date();
const daysAgo = d => new Date(now - d * 86400000).toISOString();

export const MOCK_ARTICLES = [
  // ── FEATURED ────────────────────────────────────────────────────
  {
    id: 'art0000000000001',
    title: '5 yogaövningar för en bättre natts sömn',
    slug: 'yoga-for-battre-somn',
    excerpt: 'Sömn är grunden för god hälsa. Dessa enkla yogaövningar hjälper dig att varva ner och sova djupare varje natt.',
    content: `<p>Att sova bra är en av de viktigaste grunderna för ett hälsosamt och balanserat liv. Stress och ett högt tempo gör det svårt för många att koppla av ordentligt. Här är fem yogaövningar du kan göra i sängen eller på en matta precis innan du lägger dig.</p>
<h2>1. Barnets pose – Balasana</h2>
<p>Börja på alla fyra och sänk höfterna mot hälarna. Sträck armarna framåt längs mattan och låt pannan vila mjukt. Håll i två till tre minuter med djupa, lugna andetag. Positionen lugnar nervsystemet och mjukar upp ländryggen.</p>
<h2>2. Ben upp längs väggen – Viparita Karani</h2>
<p>Lägg dig på rygg nära en vägg och vila benen mot den. Slut ögonen och fokusera på att mjukt andas ut all spänning. Stanna i fem minuter. Denna ställning minskar svullnad i benen och signalerar till kroppen att det är dags att vila.</p>
<h2>3. Liggande fjäril – Supta Baddha Konasana</h2>
<p>Ligg på rygg med fotsulorna mot varandra och knäna utåt. Lägg händerna på magen och känn hur den stiger och faller för varje andetag. Perfekt för att öppna upp höfterna och djupare muskelgrupper.</p>
<p>Gör dessa övningar i följd varje kväll i en vecka och märk skillnaden. Kombinera gärna med ett glas varmt ingefärsvatten och ett mörkt sovrum för bästa resultat.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&auto=format&fit=crop',
    category_id: 'cat0000000000001',
    category_name: 'Hälsa', category_slug: 'halsa', category_color: '#6BAE75',
    author_id: 'acac0c9c22c08924', author_name: 'Admin',
    status: 'published', featured: true, views: 4821, read_time: 5,
    tags: ['yoga', 'sömn', 'hälsa', 'mindfulness'],
    seo_title: '5 yogaövningar för bättre sömn – Livsstil24',
    seo_description: 'Sov bättre med dessa fem enkla yogaövningar du kan göra hemma varje kväll.',
    published_at: daysAgo(3), created_at: daysAgo(4), updated_at: daysAgo(3),
  },
  {
    id: 'art0000000000002',
    title: 'Höstens hetaste modetrender 2024',
    slug: 'hostens-modetrender-2024',
    excerpt: 'Från catwalk till vardagsgarderob – dessa trender dominerar hösten 2024 och ger din stil ny energi.',
    content: `<p>Hösten 2024 är en säsong av kontraster. Designerna väljer mellan mjuka, jordnära paletter och djärva grafiska mönster. Oavsett din stil finns det något för alla i årets hetaste trender.</p>
<h2>Jordtoner dominerar</h2>
<p>Terrakotta, skogsgrön och varmt karamellfärgat är höstens stora färger. Kombinera ett mustardgult oversize-linne med mörkbruna vida byxor för en modern och jordig look som fungerar hela dagen.</p>
<h2>Maximalismens återkomst</h2>
<p>Efter flera år av minimalism väljer fler att leva mer. Lager på lager, mönster på mönster och accessoarer som verkligen syns. En pälsbordering, en dramatisk axelkudde eller en handväska i reptilskinn gör skillnaden.</p>
<h2>Hållbart och vintage</h2>
<p>Secondhand är inte bara ett prisvärt alternativ – det är en stilpoäng. Vintage-fynd från 70- och 90-tal blandas med nytt för en personlig garderob med historia och karaktär.</p>
<p>Nyckeln till en lyckad höstgarderob är att investera i ett eller två statement-plagg och bygga runt dem med tidlösa basklädesplagg i bra material.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&auto=format&fit=crop',
    category_id: 'cat0000000000002',
    category_name: 'Mode', category_slug: 'mode', category_color: '#C9A96E',
    author_id: 'acac0c9c22c08924', author_name: 'Admin',
    status: 'published', featured: true, views: 3654, read_time: 6,
    tags: ['mode', 'trender', 'höst', 'stil'],
    seo_title: 'Höstens modetrender 2024 – Livsstil24',
    seo_description: 'Se vilka modetrender som dominerar hösten 2024, från jordtoner till maximalism.',
    published_at: daysAgo(5), created_at: daysAgo(6), updated_at: daysAgo(5),
  },
  {
    id: 'art0000000000003',
    title: 'Recept: Krämig pasta med rostad pumpa och salvia',
    slug: 'kramig-pasta-med-pumpa',
    excerpt: 'En härlig höstpastarätt klar på 30 minuter. Perfekt för en mysig vardagsmiddag när pumporna är som bäst.',
    content: `<p>Pumpa är höstens stora stjärna i köket. I den här rätten rostas den i ugnen med honung och timjan tills den är mjuk och karamelligerad, sedan mixas den till en len sås som omfamnar varje nudel.</p>
<h2>Ingredienser (4 portioner)</h2>
<ul><li>600 g hokkaido- eller butternutpumpa</li><li>400 g pappardelle eller tagliatelle</li><li>150 ml vispgrädde</li><li>2 vitlöksklyftor</li><li>Handfull färsk salvia</li><li>50 g parmesan</li><li>2 msk honung</li><li>Salt, peppar och olivolja</li></ul>
<h2>Gör så här</h2>
<p>Sätt ugnen på 200 grader. Skär pumpa i bitar, blanda med olivolja, honung, salt och peppar. Rosta i 25 minuter tills mjuk. Koka pastan al dente. Mixa pumpa med vitlök, grädde och lite pastavatten till en slät sås. Vänd ner pastan, toppa med friterad salvia och riven parmesan.</p>
<p>Servera direkt med ett glas torrt vitt vin. Rätten håller sig i kylen i upp till två dagar och smakar nästan ännu bättre uppvärmd.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1200&auto=format&fit=crop',
    category_id: 'cat0000000000003',
    category_name: 'Mat', category_slug: 'mat', category_color: '#E07A5F',
    author_id: 'acac0c9c22c08924', author_name: 'Admin',
    status: 'published', featured: true, views: 2987, read_time: 4,
    tags: ['recept', 'pasta', 'pumpa', 'vegetariskt'],
    seo_title: 'Krämig pasta med rostad pumpa – Recept | Livsstil24',
    seo_description: 'Enkel och läcker pasta med karamelligerad pumpa och salvia, klar på 30 minuter.',
    published_at: daysAgo(7), created_at: daysAgo(8), updated_at: daysAgo(7),
  },
  {
    id: 'art0000000000004',
    title: 'Drömresan till Santorini – allt du behöver veta',
    slug: 'dromresan-till-santorini',
    excerpt: 'Vita hus, blå kupoler och solnedgångar som tar andan ur en. Vår guide till Santorini hjälper dig att planera resan rätt.',
    content: `<p>Santorini är en av Medelhavets mest ikoniska öar, och med rätta. Den dramatiska kalderan, de klipphängda byarna och det kristallklara vattnet lockar miljontals besökare varje år. Men hur undviker man turistfällorna och hittar den äkta Santorini-upplevelsen?</p>
<h2>Bästa tiden att åka</h2>
<p>Maj, juni och september är de bästa månaderna. Sommarmånaderna är varma och soliga men fullt av turister. I september är havet som varmast, priserna rimligare och befolkningens humör avslappnat efter säsongen.</p>
<h2>Gömda pärlor bortom Oia</h2>
<p>Oia är vackert men överfyllt. Byn Pyrgos längre in på ön erbjuder de bästa utsikterna och en charmigare atmosfär. Stranden Vlychada i söder med sina vita vulkaniska klippformationer är nästan magisk och relativt okänd.</p>
<h2>Mat och dryck</h2>
<p>Prova assyrtiko-vinet som odlas på ön – ett unikt vitt vin med hög syra och mineral från vulkanjorden. Kombinera med ferskfångad fisk på en taverna i Ammoudi-bukten under Oia för en oförglömlig upplevelse.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&auto=format&fit=crop',
    category_id: 'cat0000000000004',
    category_name: 'Resor', category_slug: 'resor', category_color: '#3D405B',
    author_id: 'acac0c9c22c08924', author_name: 'Admin',
    status: 'published', featured: true, views: 2341, read_time: 7,
    tags: ['santorini', 'grekland', 'resa', 'medelhavet'],
    seo_title: 'Drömresan till Santorini – guide och tips | Livsstil24',
    seo_description: 'Allt du behöver veta för att planera din resa till Santorini, inklusive bästa tid och gömda pärlor.',
    published_at: daysAgo(10), created_at: daysAgo(11), updated_at: daysAgo(10),
  },
  {
    id: 'art0000000000005',
    title: 'Minimalism möter värme i höstens inredning',
    slug: 'minimalistisk-inredning',
    excerpt: 'Hur skapar du ett hem som känns både stilrent och ombonat? Höstens inredningstrender handlar om balansen mellan det enkla och det varma.',
    content: `<p>Den nya nordiska minimalismen handlar inte om kala väggar och tomma hyllor. Det handlar om att välja färre, men bättre saker – och att ge varje föremål utrymme att andas och synas.</p>
<h2>Textur är det nya svarta</h2>
<p>När färgpaletten är avskalad blir texturer desto viktigare. Blanda linne, ull, trä och keramik för ett rum som känns rikt utan att vara rörigt. En grov ullpläd på soffan, ett lerrätigt keramikfat på bordet och ett tjockt sisal-mattor skapar djup och värme.</p>
<h2>Växter och naturmaterial</h2>
<p>Torkade grässläkten, eukalyptus och vete i enkla vaser ger en organisk känsla utan underhåll. Kombinera med levande växter som monstera eller olivträd för ett hem som andas natur.</p>
<h2>Belysning som stämning</h2>
<p>På hösten är belysningen extra viktig. Ersätt taklampan med flera lägre ljuskällor – golvlampor, bordslampar och ljuslyktor. Välj glödlampor med varmt ljus (2700K) för en inbjudande atmosfär under de mörka kvällarna.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&auto=format&fit=crop',
    category_id: 'cat0000000000005',
    category_name: 'Hem', category_slug: 'hem', category_color: '#81B29A',
    author_id: 'acac0c9c22c08924', author_name: 'Admin',
    status: 'published', featured: true, views: 1876, read_time: 5,
    tags: ['inredning', 'minimalism', 'hem', 'höst'],
    seo_title: 'Minimalistisk höstinredning – tips och inspiration | Livsstil24',
    seo_description: 'Skapa ett ombonat och stilrent hem med höstens inredningstrender.',
    published_at: daysAgo(12), created_at: daysAgo(13), updated_at: daysAgo(12),
  },
  {
    id: 'art0000000000006',
    title: '10-stegs hudvårdsrutin för lyxig hy',
    slug: 'hudvard-10-steg',
    excerpt: 'Den koreanska 10-stegsrutinen har revolutionerat hudvårdsvärlden. Vi guidar dig genom varje steg och förklarar varför det spelar roll.',
    content: `<p>Koreansk hudvård har dominerat skönhetsvärlden de senaste åren, och det är inte utan anledning. Den systematiska och konsekventa approachen ger resultat som syns – och som håller i längden.</p>
<h2>De tio stegen</h2>
<p><strong>1. Oljebased cleanser</strong> – tar bort makeup och solskydd. <strong>2. Water-based cleanser</strong> – rengör porerna. <strong>3. Exfoliering</strong> – 2–3 gånger per vecka för att ta bort döda hudceller.</p>
<p><strong>4. Toner</strong> – återställer hudens pH och förbereder för absorption. <strong>5. Essens</strong> – en lättflytande produkt full av aktiva ämnen. <strong>6. Serum</strong> – koncentrerat och målinriktat mot dina specifika hudproblem.</p>
<p><strong>7. Sheet mask</strong> – 1–2 gånger i veckan för intensiv återfuktning. <strong>8. Ögonkräm</strong> – varsamt påstrykning med ringfingret. <strong>9. Ansiktskräm</strong> – skapar en barriär och låser in fukt. <strong>10. Solskydd</strong> – det viktigaste steget för att förebygga åldrande.</p>
<p>Du behöver inte göra alla tio steg varje dag. Börja med tre till fem och lägg till fler när du hittat produkter som fungerar för din hud.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&auto=format&fit=crop',
    category_id: 'cat0000000000006',
    category_name: 'Skönhet', category_slug: 'skonhet', category_color: '#D4A0A0',
    author_id: 'acac0c9c22c08924', author_name: 'Admin',
    status: 'published', featured: true, views: 1543, read_time: 6,
    tags: ['hudvård', 'koreansk', 'skönhet', 'rutin'],
    seo_title: '10-stegs hudvårdsrutin – koreansk skönhet | Livsstil24',
    seo_description: 'Lär dig den koreanska 10-stegsrutinen för en strålande och hälsosam hy.',
    published_at: daysAgo(14), created_at: daysAgo(15), updated_at: daysAgo(14),
  },

  // ── REGULAR ─────────────────────────────────────────────────────
  {
    id: 'art0000000000007',
    title: 'Meditation för nybörjare – kom igång på 10 minuter',
    slug: 'meditation-for-nyborjare',
    excerpt: 'Du behöver inte timmar av tystnad eller ett speciellt rum. Meditation fungerar var du än är – och börjar verka snabbare än du tror.',
    content: `<p>Meditation är en av de kraftfullaste verktygen vi har för att hantera stress och skapa inre ro – men myterna om att det kräver lång träning eller speciella förutsättningar skrämmer bort många. Sanningen är att tio minuter per dag räcker för att märka en tydlig skillnad.</p>
<h2>Börja med andningen</h2>
<p>Sätt dig bekvämt, stäng ögonen och fokusera enbart på din andning. Räkna varje utandning upp till tio, börja sedan om. När tankarna vandrar iväg – och det kommer de att göra – leder du varsamt uppmärksamheten tillbaka. Det är övningen.</p>
<p>Använd en app som Calm eller Insight Timer de första veckorna för guidad meditation. Många av de bästa sessionerna är gratis och anpassade för nybörjare.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&auto=format&fit=crop',
    category_id: 'cat0000000000001',
    category_name: 'Hälsa', category_slug: 'halsa', category_color: '#6BAE75',
    author_id: 'acac0c9c22c08924', author_name: 'Admin',
    status: 'published', featured: false, views: 987, read_time: 4,
    tags: ['meditation', 'stress', 'mindfulness'],
    seo_title: 'Meditation för nybörjare | Livsstil24',
    seo_description: 'Kom igång med meditation på bara tio minuter om dagen.',
    published_at: daysAgo(16), created_at: daysAgo(17), updated_at: daysAgo(16),
  },
  {
    id: 'art0000000000008',
    title: 'Bygg en hållbar garderob – 10 investeringsplagg',
    slug: 'hallbar-garderob',
    excerpt: 'Färre men bättre – en hållbar garderob sparar pengar, minskar miljöpåverkan och gör dig mer välklädd varje dag.',
    content: `<p>Fast fashion är billigt i kassan men dyrt i längden – för plånboken, för planeten och för din personliga stil. En kapselgarderob med genomtänkta, hållbara plagg skapar fler outfits med färre kläder.</p>
<h2>De tio basplagg du behöver</h2>
<p>En välsydd kostymbyxa i grått eller marinblått. En vit skjorta i naturfiber. En tröja i kashmirull. En klassisk trenchcoat. Mörkblå slim jeans. En enfärgad t-shirt utan tryck. Loafers i läder. En strukturerad axelväska. En halvlång klänning som går att klä upp eller ner. Och slutligen ett par vita sneakers av god kvalitet.</p>
<p>Välj plagg av naturmaterial som ull, bomull, lin och siden. De håller längre, andas bättre och åldras med grace. Investera i ett plagg per månad snarare än tio billiga alternativ på en gång.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&auto=format&fit=crop',
    category_id: 'cat0000000000002',
    category_name: 'Mode', category_slug: 'mode', category_color: '#C9A96E',
    author_id: 'acac0c9c22c08924', author_name: 'Admin',
    status: 'published', featured: false, views: 854, read_time: 5,
    tags: ['garderob', 'hållbart', 'mode', 'capsule'],
    seo_title: 'Bygg en hållbar kapselgarderob | Livsstil24',
    seo_description: 'Tio investeringsplagg för en hållbar och tidlös garderob.',
    published_at: daysAgo(18), created_at: daysAgo(19), updated_at: daysAgo(18),
  },
  {
    id: 'art0000000000009',
    title: 'Veganrecept som imponerar på hela middagsbordet',
    slug: 'veganrecept-som-imponerar',
    excerpt: 'Tre växtbaserade rätter som är så goda att ingen saknar köttet. Perfekta för en middagsbjudning eller en lyxig vardagsmiddag.',
    content: `<p>Vegansk mat har länge burits upp av rykte om att vara trist och näringslös. Men de senaste åren har det hänt enormt mycket – och här är tre rätter som bevisar att växtbaserat är precis lika spännande och mättande som klassisk matlagning.</p>
<h2>Rostad blomkål med harissa och granatäpple</h2>
<p>Dela ett helt blomkålshuvud i tjocka skivor och rosta i 220 grader tills kanterna är djupbruna och krispiga. Servera på ett lager hummus, drizzla med harrisa-olja och toppa med granatäppelkärnor, hackad mynta och tahini.</p>
<h2>Linssoppa med rostad paprika och spiskummin</h2>
<p>Koka röda linser med rostad paprika, tomat, spiskummin och rökt paprika. Mixa hälften för en krämig konsistens. Avsluta med citronsaft och färsk koriander. Servera med bröd i Libanesisk stil.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&auto=format&fit=crop',
    category_id: 'cat0000000000003',
    category_name: 'Mat', category_slug: 'mat', category_color: '#E07A5F',
    author_id: 'acac0c9c22c08924', author_name: 'Admin',
    status: 'published', featured: false, views: 743, read_time: 5,
    tags: ['vegansk', 'recept', 'växtbaserat', 'middag'],
    seo_title: 'Imponerande veganrecept för middagsbjudning | Livsstil24',
    seo_description: 'Tre växtbaserade rätter som imponerar på hela middagsbordet.',
    published_at: daysAgo(20), created_at: daysAgo(21), updated_at: daysAgo(20),
  },
  {
    id: 'art0000000000010',
    title: 'Island på vintern – ett arktiskt äventyr',
    slug: 'island-vinterdrom',
    excerpt: 'Norrskenet, de geotermala baden och tystnaden. Island på vintern är en av världens mest magiska reseupplevelser.',
    content: `<p>De flesta besöker Island under sommaren för det midnattsljus och de gröna landskap. Men vintern erbjuder en helt annan – och för många ännu vackrare – upplevelse. Mörker, eld och is skapar en stämning som är svår att hitta någon annanstans.</p>
<h2>Norrskenet</h2>
<p>Aurora borealis är Islands absoluta vinterhöjdpunkt. De bästa förutsättningarna är klara nätter långt från stadsljus mellan september och mars. Boka en norrskenstur med guide eller hyra bil och kör söderut från Reykjavik mot Þórsmörk.</p>
<h2>Blue Lagoon och hemliga bad</h2>
<p>Blue Lagoon är berömd med anledning, men boka alltid i förväg. Vill du undvika köer, prova Fontana i Laugarvatn eller det lilla hemliga badet vid Hrunalaug – ett naturligt varmvattenspool omgiven av snö och is.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&auto=format&fit=crop',
    category_id: 'cat0000000000004',
    category_name: 'Resor', category_slug: 'resor', category_color: '#3D405B',
    author_id: 'acac0c9c22c08924', author_name: 'Admin',
    status: 'published', featured: false, views: 698, read_time: 6,
    tags: ['island', 'nordljus', 'vinterresa', 'äventyr'],
    seo_title: 'Island på vintern – guide till norrskenet | Livsstil24',
    seo_description: 'Upplev Islands magi under vintermånaderna med norrsken, geotermala bad och arktiska landskap.',
    published_at: daysAgo(22), created_at: daysAgo(23), updated_at: daysAgo(22),
  },
  {
    id: 'art0000000000011',
    title: 'Träna effektivt på 30 minuter – din kompletta guide',
    slug: 'effektiv-traning-30-min',
    excerpt: 'Du behöver inte timslånga pass på gymmet för att hålla dig i form. Med rätt upplägg räcker 30 minuter om dagen mer än väl.',
    content: `<p>Tid är vår mest begränsade resurs. Och det är just därför som 30-minutersträningen har blivit den populäraste formen av motion för moderna, aktiva människor. Nyckeln är att maximera intensiteten och minimera vilan.</p>
<h2>HIIT – High Intensity Interval Training</h2>
<p>Varannan minut hög intensitet, varannan minut lugn återhämtning. Detta upplägg förbränner mer kalorier per minut än stationär konditionsträning och fortsätter att förbränna fett i timmar efter passet.</p>
<h2>En komplett 30-minutersrutin</h2>
<p>5 min uppvärmning, 20 min cirkelträning (burpees, knäböj, armhävningar, utfall, mountain climbers), 5 min nedvarvning och stretching. Gör detta tre till fyra gånger i veckan och komplettera med en längre promenad de övriga dagarna.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&auto=format&fit=crop',
    category_id: 'cat0000000000001',
    category_name: 'Hälsa', category_slug: 'halsa', category_color: '#6BAE75',
    author_id: 'acac0c9c22c08924', author_name: 'Admin',
    status: 'published', featured: false, views: 612, read_time: 4,
    tags: ['träning', 'HIIT', 'kondition', 'hälsa'],
    seo_title: 'Effektiv träning på 30 minuter | Livsstil24',
    seo_description: 'Komplett träningsguide för ett effektivt 30-minuterspass hemma eller på gymmet.',
    published_at: daysAgo(24), created_at: daysAgo(25), updated_at: daysAgo(24),
  },
  {
    id: 'art0000000000012',
    title: 'Cityguide: Det bästa i Lissabon just nu',
    slug: 'lissabon-cityguide',
    excerpt: 'Lissabon har exploderat som resedestination de senaste åren – och med rätta. Vår guide tar dig till stadens bästa restauranger, butiker och vyer.',
    content: `<p>Lissabon är Europas solrikaste huvudstad och en stad som ständigt förvånar med sin blandning av melankoli och livsvilja. Fado-musik, azulejo-kakel, pastéis de nata och soleiga uteserveringar – det finns mycket att älska.</p>
<h2>Äta och dricka</h2>
<p>Frukostera på Time Out Market och prova petiscos – portugisiska tapas – på Tasca do Chico i Bairro Alto. Kvällsmaten tas bäst på en av de nyrenoverade restaurangerna i LX Factory, det kreativa komplexet i en f.d. fabrik längs Tejofloden.</p>
<h2>Se och uppleva</h2>
<p>Hoppa på spårvagn 28 och åk genom Alfama, stadens äldsta kvarter. Promenera längs Av. da Liberdade för lyxiga butiker, eller utforska de coola second hand-affärerna i Príncipe Real. Solnedgången sedd från Miradouro da Graça är oöverträffad.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop',
    category_id: 'cat0000000000004',
    category_name: 'Resor', category_slug: 'resor', category_color: '#3D405B',
    author_id: 'acac0c9c22c08924', author_name: 'Admin',
    status: 'published', featured: false, views: 589, read_time: 6,
    tags: ['lissabon', 'portugal', 'cityguide', 'matresa'],
    seo_title: 'Cityguide Lissabon – bästa tips och platser | Livsstil24',
    seo_description: 'Vår kompletta guide till Lissabons bästa restauranger, upplevelser och dolda pärlor.',
    published_at: daysAgo(26), created_at: daysAgo(27), updated_at: daysAgo(26),
  },
  {
    id: 'art0000000000013',
    title: 'Gör din egen naturliga ansiktsmask',
    slug: 'naturlig-ansiktsmask',
    excerpt: 'Skönhet behöver inte komma i en dyr förpackning. Dessa tre DIY-masker med naturliga ingredienser ger din hud ett lyft – och kostar nästan ingenting.',
    content: `<p>Köksrummet är faktiskt det bästa skönhetsapoteket du har. Många vanliga livsmedel innehåller aktiva ämnen som honungsenzym, mejerisyror och antioxidanter som gör underverk för huden – utan kemikalier, parfymer eller onödiga tillsatser.</p>
<h2>Mask 1: Honung och havremjöl</h2>
<p>Blanda 2 msk rå honung med 1 msk havremjöl till en pasta. Applicera på rengjort ansikte i 15 minuter. Honung är antibakteriell och lugnande, havremjölet exfolierar varsamt. Perfekt för känslig eller röd hud.</p>
<h2>Mask 2: Gurka och yoghurt</h2>
<p>Mixa en halv gurka och blanda med 2 msk osötad grecisk yoghurt. Perfekt för värmeskadad, torr eller irriterad hud. Mjölksyrorna i yoghurten ljusar upp och jämnar ut hudtonen.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop',
    category_id: 'cat0000000000006',
    category_name: 'Skönhet', category_slug: 'skonhet', category_color: '#D4A0A0',
    author_id: 'acac0c9c22c08924', author_name: 'Admin',
    status: 'published', featured: false, views: 534, read_time: 4,
    tags: ['skönhet', 'DIY', 'naturlig', 'ansiktsmask'],
    seo_title: 'Gör din egen naturliga ansiktsmask | Livsstil24',
    seo_description: 'Tre enkla DIY-ansiktsmasker med naturliga ingredienser från köket.',
    published_at: daysAgo(28), created_at: daysAgo(29), updated_at: daysAgo(28),
  },
  {
    id: 'art0000000000014',
    title: 'Bästa växter för ett friskare hem',
    slug: 'vaxter-i-hemmet',
    excerpt: 'Inomhusväxter är mer än dekoration. De renar luften, minskar stress och skapar en levande atmosfär i hemmet.',
    content: `<p>Forskning från NASA visar att vissa inomhusväxter effektivt renar luften från formaldehyd, bensen och andra flyktiga ämnen. Men det handlar inte bara om luftkvaliteten – växter gör oss faktiskt gladare och mer produktiva.</p>
<h2>Monstera deliciosa</h2>
<p>Höstens och vinterns populäraste växt är fortfarande monsteran. Den kräver lite skötsel, klarar halvskugga och växer snabbt till en imponerande storlek. Vattna en gång i veckan och torka av bladen med en fuktig trasa.</p>
<h2>Sansevieria – svärmors tunga</h2>
<p>Den nästan okränkbara sansevierian omvandlar koldioxid till syre även på natten – vilket gör den perfekt för sovrummet. Vattna bara var tredje till fjärde vecka och låt den stå i valfritt ljusläge.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&auto=format&fit=crop',
    category_id: 'cat0000000000005',
    category_name: 'Hem', category_slug: 'hem', category_color: '#81B29A',
    author_id: 'acac0c9c22c08924', author_name: 'Admin',
    status: 'published', featured: false, views: 478, read_time: 4,
    tags: ['växter', 'hem', 'inredning', 'hälsa'],
    seo_title: 'Bästa inomhusväxter för ett friskare hem | Livsstil24',
    seo_description: 'Vilka växter renar luften och skapar en friskare miljö i ditt hem.',
    published_at: daysAgo(30), created_at: daysAgo(31), updated_at: daysAgo(30),
  },
  {
    id: 'art0000000000015',
    title: 'Designer vintage – hitta fynd på secondhand',
    slug: 'vintage-mode-fynd',
    excerpt: 'Secondhand är den nya lyxen. Vi visar hur du hittar äkta designerplagg till en bråkdel av originalpriset.',
    content: `<p>Marknaden för begagnade designerplagget har exploderat. Depop, Vestiaire Collective och lokala loppmarknader är guldgruvor för den som vet vad man letar efter. Och det handlar inte bara om att spara pengar – det handlar om att äga unika plagg med historia.</p>
<h2>Var letar du?</h2>
<p>Vestiaire Collective och TheRealReal är de bästa plattformarna för autentifierade designerplagget online. Lokalt är secondhandbutiker i välbärgade stadsdelar ofta bättre försedda – folk skänker eller säljer kläder de sällan använde.</p>
<h2>Vad letar du efter?</h2>
<p>Investeringsplaggen är de med tidlös design och hög kvalitet: Burberry-trenchcoat, Levi's 501 från 80-90-tal, vintage Chanel-kavaj eller en Hermès-scarf. Undvik trendplagg på secondhand – de har ofta tappat sin relevans.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&auto=format&fit=crop',
    category_id: 'cat0000000000002',
    category_name: 'Mode', category_slug: 'mode', category_color: '#C9A96E',
    author_id: 'acac0c9c22c08924', author_name: 'Admin',
    status: 'published', featured: false, views: 423, read_time: 5,
    tags: ['vintage', 'secondhand', 'designer', 'hållbart'],
    seo_title: 'Hitta designer vintage på secondhand | Livsstil24',
    seo_description: 'Guide till att hitta äkta designerplagget till bra priser på secondhand.',
    published_at: daysAgo(32), created_at: daysAgo(33), updated_at: daysAgo(32),
  },
  {
    id: 'art0000000000016',
    title: 'Mindfulness i vardagen – 5 enkla övningar',
    slug: 'mindfulness-vardagen',
    excerpt: 'Mindfulness handlar inte om att sitta stilla med slutna ögon. Det handlar om att vara helt närvarande i det du gör just nu.',
    content: `<p>Mindfulness – medveten närvaro – är ett av de effektivaste verktygen för att reducera stress och öka välmåendet i vardagen. Och det bästa: det kräver varken tid eller utrustning.</p>
<h2>1. Det medvetna frukostögonblicket</h2>
<p>Lägg undan telefonen under frukost. Smaka verkligen på maten, känn doften av kaffet, lyssna på ljudet runt dig. Det tar inte extra tid – det är samma frukost, men nu faktiskt upplevd.</p>
<h2>2. Mindful promenad</h2>
<p>Ta en promenad utan öronproppar. Lägg märke till vad du ser, hör och känner. Notera tre saker du aldrig observerat tidigare på din vanliga väg. Hjärnan är fantastisk på att filtrera bort det bekanta – det är dags att se igen.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&auto=format&fit=crop',
    category_id: 'cat0000000000001',
    category_name: 'Hälsa', category_slug: 'halsa', category_color: '#6BAE75',
    author_id: 'acac0c9c22c08924', author_name: 'Admin',
    status: 'published', featured: false, views: 398, read_time: 4,
    tags: ['mindfulness', 'stress', 'närvaro', 'hälsa'],
    seo_title: 'Mindfulness i vardagen – enkla övningar | Livsstil24',
    seo_description: '5 enkla mindfulnessövningar du kan göra mitt i din vanliga vardag.',
    published_at: daysAgo(34), created_at: daysAgo(35), updated_at: daysAgo(34),
  },
  {
    id: 'art0000000000017',
    title: 'Snabb och nyttig frukost på fem minuter',
    slug: 'frukost-pa-5-minuter',
    excerpt: 'Skippa morgonstresset med dessa tre snabba frukostrecept som mättar, ger energi och smakar fantastiskt – allt klart på fem minuter.',
    content: `<p>Frukost är veckans viktigaste måltid – eller åtminstone en av dem. Men morgon är för de flesta den stressigaste stunden på dygnet. Här är tre recept som tar fem minuter att laga och ger dig energi hela förmiddagen.</p>
<h2>Smoothiebowl med bär och granola</h2>
<p>Mixa en fryst banan, en handfull frysta blåbär och 100 ml mandelmjölk till en tjock smoothie. Toppa med granola, färska bär och en sked mandelsmör. Klart på tre minuter och vackert nog för Instagram.</p>
<h2>Ägg i avokado</h2>
<p>Halvera en avokado, ta ut lite av fruktköttet, knäck ett ägg i hålet och grädda i 200 grader i 12 minuter. Salt, peppar och chiliflingor. Fullt med nyttiga fetter och protein som håller dig mätt till lunch.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&auto=format&fit=crop',
    category_id: 'cat0000000000003',
    category_name: 'Mat', category_slug: 'mat', category_color: '#E07A5F',
    author_id: 'acac0c9c22c08924', author_name: 'Admin',
    status: 'published', featured: false, views: 367, read_time: 3,
    tags: ['frukost', 'recept', 'snabbt', 'nyttigt'],
    seo_title: 'Snabb nyttig frukost på 5 minuter | Livsstil24',
    seo_description: 'Tre snabba och nyttiga frukostrecept klara på fem minuter.',
    published_at: daysAgo(36), created_at: daysAgo(37), updated_at: daysAgo(36),
  },
  {
    id: 'art0000000000018',
    title: 'Skapa ett hemmakontor du trivs i',
    slug: 'hemmakontor-tips',
    excerpt: 'Ett välplanerat hemmakontor ökar produktiviteten, minskar stress och gör det lättare att separera arbete från fritid.',
    content: `<p>Hemarbete är för de flesta nu ett permanent inslag i vardagen. Men att arbeta vid köksbordet bland familjemedlemmars ljud är sällan produktivt. Här är tipsen för att skapa ett riktigt hemmakontor – oavsett hur lite utrymme du har.</p>
<h2>Platsen spelar roll</h2>
<p>Välj ett hörn med naturligt ljus och om möjligt en dörr du kan stänga. En dedikerad plats signalerar till hjärnan att "nu jobbar vi" – vilket ökar fokus och gör det lättare att faktiskt stänga av när arbetsdagen är slut.</p>
<h2>Ergonomi är investering</h2>
<p>En bra stol och ett skrivbord i rätt höjd är inte lyx, det är nödvändigt. Skärmen ska vara i ögonhöjd, tangentbordet ska ligga så att armbågarna är i 90 grader. Ryggproblem kostar mer i längden än ett ergonomiskt skrivbord.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&auto=format&fit=crop',
    category_id: 'cat0000000000005',
    category_name: 'Hem', category_slug: 'hem', category_color: '#81B29A',
    author_id: 'acac0c9c22c08924', author_name: 'Admin',
    status: 'published', featured: false, views: 312, read_time: 5,
    tags: ['hemmakontor', 'produktivitet', 'inredning', 'arbete'],
    seo_title: 'Skapa ett hemmakontor du trivs i | Livsstil24',
    seo_description: 'Tips för att inreda ett produktivt och trivsamt hemmakontor hemma.',
    published_at: daysAgo(38), created_at: daysAgo(39), updated_at: daysAgo(38),
  },
  {
    id: 'art0000000000019',
    title: '10 superfoods du borde äta varje dag',
    slug: 'superfoods-du-borde-ata',
    excerpt: 'Superfoods behöver inte vara exotiska eller dyra. Dessa tio livsmedel finns i din vanliga matbutik och gör enorm skillnad för din hälsa.',
    content: `<p>Termen "superfood" är till stor del ett marknadsföringsbegrepp, men det finns livsmedel som är genuint mer näringsdensa än andra. Här är tio du borde integrera i din kost varje dag.</p>
<h2>1. Blåbär</h2>
<p>Antioxidantrika och fulla av C-vitamin, K-vitamin och fiber. Svenska vildblåbär är kraftfullare än odlade varianter och tillgängliga frysta året runt.</p>
<h2>2. Valnötter</h2>
<p>En handfull om dagen minskar risken för hjärtsjukdom med upp till 35 procent enligt studier. Fullpackade med omega-3 och magnesium.</p>
<h2>3. Ingefära</h2>
<p>Antiinflammatorisk, immunförstärkande och bra mot illamående. Riv ner i smoothies, te och dressingar för en daglig dos.</p>
<p>De övriga sju: ägg, lax, spenat, gurkmeja, mörk choklad (70%+), fermenterade livsmedel och havregryn. Alla tillgängliga, alla prisvärda.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&auto=format&fit=crop',
    category_id: 'cat0000000000001',
    category_name: 'Hälsa', category_slug: 'halsa', category_color: '#6BAE75',
    author_id: 'acac0c9c22c08924', author_name: 'Admin',
    status: 'published', featured: false, views: 289, read_time: 5,
    tags: ['superfoods', 'kost', 'näring', 'hälsa'],
    seo_title: '10 superfoods att äta varje dag | Livsstil24',
    seo_description: 'Tio tillgängliga superfoods som gör stor skillnad för din hälsa.',
    published_at: daysAgo(40), created_at: daysAgo(41), updated_at: daysAgo(40),
  },
  {
    id: 'art0000000000020',
    title: 'Veckans streetwear – de hetaste märkena 2024',
    slug: 'streetwear-marken-2024',
    excerpt: 'Streetwear har blivit mainstream, men det finns fortfarande märken som håller autenticiteten och kantar sig mot det kommersiella.',
    content: `<p>Streetwear är inte längre underground – det är haute couture. Men det finns fortfarande märken och communities som värnar om kulturens rötter i skateboarding, hiphop och japansk ungdomskultur.</p>
<h2>Palace Skateboards</h2>
<p>Brittiska Palace fortsätter att leverera de coolaste samarbetena med en autentisk skateboardkänsla. Deras tröjor och jackor är eftertraktade och håller på andrahandsmarknaden.</p>
<h2>Aime Leon Dore</h2>
<p>New York-baserade ALD är kanske det mest hype-fria märket med hög hype. Deras inspel på 90-talsmode, preppy estetik och New York-attityd är unik och autentisk.</p>`,
    featured_image: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=1200&auto=format&fit=crop',
    category_id: 'cat0000000000002',
    category_name: 'Mode', category_slug: 'mode', category_color: '#C9A96E',
    author_id: 'acac0c9c22c08924', author_name: 'Admin',
    status: 'draft', featured: false, views: 0, read_time: 5,
    tags: ['streetwear', 'mode', 'märken', 'urban'],
    seo_title: 'Hetaste streetwear-märken 2024 | Livsstil24',
    seo_description: 'De bästa streetwear-märkena att hålla koll på under 2024.',
    published_at: null, created_at: daysAgo(1), updated_at: daysAgo(1),
  },
];

// ── Customers ─────────────────────────────────────────────────────────────────
export const MOCK_CUSTOMERS = [
  { id: 'cus0000000000001', company: 'Naturliga Skönhet AB', contact_name: 'Anna Lindqvist', email: 'anna@naturligaskonhet.se', phone: '070-123 45 67', org_number: '556123-4567', address: 'Drottninggatan 42, Stockholm', website: 'https://naturligaskonhet.se', notes: 'Premiumkund sedan 2023', status: 'active', created_at: daysAgo(120) },
  { id: 'cus0000000000002', company: 'Svensk Mode Group', contact_name: 'Erik Johansson', email: 'erik@svenskmode.se', phone: '073-234 56 78', org_number: '556234-5678', address: 'Biblioteksgatan 8, Stockholm', website: 'https://svenskmode.se', notes: 'Årskontrakt, förnyelse i december', status: 'active', created_at: daysAgo(200) },
  { id: 'cus0000000000003', company: 'FitLife Sverige', contact_name: 'Maria Petersson', email: 'maria@fitlife.se', phone: '076-345 67 89', org_number: '556345-6789', address: 'Linnégatan 12, Göteborg', website: 'https://fitlife.se', notes: 'Fokus på hälsa-kategorin', status: 'active', created_at: daysAgo(90) },
  { id: 'cus0000000000004', company: 'Resebyrån Äventyr', contact_name: 'Johan Berg', email: 'johan@aventyr.se', phone: '070-456 78 90', org_number: '556456-7890', address: 'Stortorget 5, Malmö', website: 'https://aventyr.se', notes: 'Säsongsannonsering sommaren 2024', status: 'inactive', created_at: daysAgo(300) },
  { id: 'cus0000000000005', company: 'Hemma & Trädgård AB', contact_name: 'Sofia Carlsson', email: 'sofia@hemmaotradgard.se', phone: '073-567 89 01', org_number: '556567-8901', address: 'Kungsgatan 20, Uppsala', website: 'https://hemmaotradgard.se', notes: 'Ny kund, intresserade av hem-kategorin', status: 'active', created_at: daysAgo(30) },
];

// ── Ad Placements ─────────────────────────────────────────────────────────────
export const MOCK_PLACEMENTS = [
  { id: 'pla0000000000001', name: 'Hero Banner', position_key: 'hero_banner', key: 'hero_banner', description: 'Stor banner längst upp på startsidan, synlig för alla besökare.', price_monthly: 6900, price_per_month: 6900, max_ads: 1, is_active: true, active_ads: 1 },
  { id: 'pla0000000000002', name: 'Footer Banner', position_key: 'footer_banner', key: 'footer_banner', description: 'Banner i footern, synlig längst ner på alla sidor.', price_monthly: 3900, price_per_month: 3900, max_ads: 1, is_active: true, active_ads: 1 },
  { id: 'pla0000000000003', name: 'Sidopanel Topp', position_key: 'sidebar_top', key: 'sidebar_top', description: 'Annons överst i höger sidopanel på artikelsidor.', price_monthly: 2900, price_per_month: 2900, max_ads: 1, is_active: true, active_ads: 1 },
  { id: 'pla0000000000004', name: 'Sidopanel Mitten', position_key: 'sidebar_mid', key: 'sidebar_mid', description: 'Annons i mitten av höger sidopanel på artikelsidor.', price_monthly: 2400, price_per_month: 2400, max_ads: 1, is_active: true, active_ads: 0 },
  { id: 'pla0000000000005', name: 'Kategori Topp', position_key: 'category_top', key: 'category_top', description: 'Banner överst på kategorisidor.', price_monthly: 1900, price_per_month: 1900, max_ads: 1, is_active: true, active_ads: 0 },
  { id: 'pla0000000000006', name: 'Artikel Inline', position_key: 'article_inline', key: 'article_inline', description: 'Annons inbäddad mitt i artikeltext.', price_monthly: 2400, price_per_month: 2400, max_ads: 1, is_active: true, active_ads: 1 },
];

// ── Ads ───────────────────────────────────────────────────────────────────────
export const MOCK_ADS = [
  {
    id: 'ad00000000000001',
    title: 'Naturliga Skönhet – Höstkollektion',
    image_url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&auto=format&fit=crop',
    link_url: 'https://naturligaskonhet.se',
    alt_text: 'Upp till 30% på höstens skönhetsprodukter',
    ad_type: 'video', video_url: '/mock_ad.mp4',
    placement_id: 'pla0000000000001', customer_id: 'cus0000000000001',
    status: 'active', start_date: null, end_date: null,
    impressions: 12450, clicks: 287, price_paid: 6900,
  },
  {
    id: 'ad00000000000002',
    title: 'FitLife – Träna hemma i höst',
    image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&auto=format&fit=crop',
    link_url: 'https://fitlife.se',
    alt_text: 'Starta din träningsresa idag',
    ad_type: 'video', video_url: '/mock_ad.mp4',
    placement_id: 'pla0000000000002', customer_id: 'cus0000000000003',
    status: 'active', start_date: null, end_date: null,
    impressions: 8923, clicks: 156, price_paid: 3900,
  },
  {
    id: 'ad00000000000003',
    title: 'Svensk Mode – Nytt i butik',
    image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&auto=format&fit=crop',
    link_url: 'https://svenskmode.se',
    alt_text: 'Höstens nyheter nu inne',
    ad_type: 'image', video_url: null,
    placement_id: 'pla0000000000003', customer_id: 'cus0000000000002',
    status: 'active', start_date: null, end_date: null,
    impressions: 5670, clicks: 198, price_paid: 2900,
  },
  {
    id: 'ad00000000000004',
    title: 'Hemma & Trädgård – Höstrea',
    image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&auto=format&fit=crop',
    link_url: 'https://hemmaotradgard.se',
    alt_text: 'Inred ditt hem för hösten',
    ad_type: 'image', video_url: null,
    placement_id: 'pla0000000000006', customer_id: 'cus0000000000005',
    status: 'active', start_date: null, end_date: null,
    impressions: 3210, clicks: 89, price_paid: 2400,
  },
];

// ── Settings ──────────────────────────────────────────────────────────────────
export const MOCK_SETTINGS = {
  site_description: 'Din digitala livsstilstidning för mode, skönhet och det moderna livet.',
  instagram_url: 'https://instagram.com/livsstil24',
  facebook_url:  'https://facebook.com/livsstil24',
  tiktok_url:    'https://tiktok.com/@livsstil24',
  logo_url:      '',
  favicon_url:   '',
};

// ── Views by day (30 days, deterministic) ─────────────────────────────────────
export const MOCK_VIEWS_BY_DAY = (() => {
  const pattern = [320,280,340,390,420,380,190,300,350,410,380,290,220,160,340,370,420,450,400,310,200,290,340,380,410,360,270,185,330,370];
  const days = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push({ date: d.toISOString().split('T')[0], views: pattern[29 - i] || 300 });
  }
  return days;
})();
