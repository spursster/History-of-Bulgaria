document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.searchbox');
  const input = document.getElementById('search');
  const results = document.getElementById('search-results');
  const article = document.querySelector('article');

  const randomRulers = [
    { name: 'Авитохол', page: 'Стара Велика България', description: 'Легендарен владетел от „Именника на българските владетели“, смятан за предтеча на ранната българска държавност.' },
    { name: 'Атила', page: 'Стара Велика България', description: 'Фигура от ранните хроники, свързвана с разрушителни походи и легендарен статус в българската представа за първи владетели.' },
    { name: 'Ирник', page: 'Стара Велика България', description: 'Името на владетел, споменат в стария списък на българските владетели, с легендарен облик и исторически препратки.' },
    { name: 'Заберган', page: 'Стара Велика България', description: 'Ранен владетел, чието име се появява в преданията за българската династия.' },
    { name: 'Сандилх', page: 'Стара Велика България', description: 'Един от първите митични управители, упоменати в средновековните списъци.' },
    { name: 'Аскал', page: 'Стара Велика България', description: 'Още един от редицата ранни имена, свързани с легендарния произход на държавата.' },
    { name: 'Албури', page: 'Стара Велика България', description: 'Легендарен владетел от древните списъци на българските управляващи.' },
    { name: 'Патриций Органа', page: 'Стара Велика България', description: 'Управлявал до около 623 г.; началният момент на неговото управление не е добре установен.' },
    { name: 'Патриций Кубрат', page: 'Стара Велика България', description: 'Известен като основател на ранната съюзна българска държава, предшествал създаването на държавата на Аспарух.' },
    { name: 'Батбаян', page: 'Стара Велика България', description: 'Син на Кубрат и последният владетел на стария български съюз преди разпадането му.' },
    { name: 'Котраг', page: 'Волжка България', description: 'Един от ранните владетели на Волжка България, свързан с разширяване към река Волга.' },
    { name: 'Иркхан', page: 'Волжка България', description: 'Владетел, описан като наследник на Котраг и укрепил властта в региона.' },
    { name: 'Туки', page: 'Волжка България', description: 'Ранен управител на Волжка България, управлявал в периода около VIII век.' },
    { name: 'Урус-Айдар', page: 'Волжка България', description: 'Владетел, който е споменат в списъка на лидерите на Волжка България.' },
    { name: 'Габдулла Джилки', page: 'Волжка България', description: 'Син на Урус-Айдар, който наследява управлението през IX век.' },
    { name: 'Бал-Угор Мумин', page: 'Волжка България', description: 'Значим управител, продължил политиката на укрепване на държавата.' },
    { name: 'Алмъш Джафар', page: 'Волжка България', description: 'Владетел и син на Джилки, свързан с последователно управление през края на IX и началото на X век.' },
    { name: 'Хасан Газан Мумин', page: 'Волжка България', description: 'Син на Алмъш Джафар, който управлявал през X век.' },
    { name: 'Микаил Ялкау Балтавар', page: 'Волжка България', description: 'Владетел на Волжка България през началото на X век, син на Алмъш.' },
    { name: 'Мохаммед', page: 'Волжка България', description: 'Още един владетел от рода на управниците на Волжка България през X век.' },
    { name: 'Талиб Мумин', page: 'Волжка България', description: 'Управител на Волжка България в края на X век, известен с продължителността на своя престой.' },
    { name: 'Тимар Мумин Баджанак', page: 'Волжка България', description: 'Син на Мохаммед, който управлявал около хилядаелетието.' },
    { name: 'Масгут', page: 'Волжка България', description: 'Управител от началото на XI век, свързан с преходни времена в държавата.' },
    { name: 'Ибрахим', page: 'Волжка България', description: 'Син на Мохаммед, който ръководи държавата през първата половина на XI век.' },
    { name: 'Азгар', page: 'Волжка България', description: 'Претендент за власт в началото на XI век, наричан още Азгар Мумин.' },
    { name: 'Ашраф – кан Балук', page: 'Волжка България', description: 'Управител, който възстановява реда след периоди на нестабилност в XI век.' },
    { name: 'Ахад Мосха', page: 'Волжка България', description: 'Син на Азгар, управлявал през средата на XI век.' },
    { name: 'Адам', page: 'Волжка България', description: 'Син на Балук, който управлявал в края на XI – началото на XII век.' },
    { name: 'Шамгун Шам-Саин', page: 'Волжка България', description: 'Син на Адам, управлявал през първата половина на XII век.' },
    { name: 'Хисам Анбал', page: 'Волжка България', description: 'Внук на Ахад и син на Колън, който ръководил държавата през XII век.' },
    { name: 'Улуг-Мохаммед Отяк Джанги', page: 'Волжка България', description: 'Син на Шамгун, който управлявал до средата на XIII век.' },
    { name: 'Габдула Челбир', page: 'Волжка България', description: 'Син на Отяк, управлявал през ранния XIII век и съхранил държавата.' },
    { name: 'Мир-Гази', page: 'Волжка България', description: 'Син на Отяк, който поел властта след Челбир.' },
    { name: 'Джелал-ед-Дин Алтьнбек Алан', page: 'Волжка България', description: 'Син на Отяк, управлявал през XIII век в кратки епизоди.' },
    { name: 'Гази-Барадж Бурундай', page: 'Волжка България', description: 'Правнук на Шамгун и син на Азан, управлявал на два пъти през XIII век.' },
    { name: 'Хисам', page: 'Волжка България', description: 'Син на Гази-Барадж, който наследил престола през XIII век.' },
    { name: 'Тухчи-Исмаил', page: 'Волжка България', description: 'Внук на Челбир, управлявал през средата на XIII век.' },
    { name: 'Галимбек', page: 'Волжка България', description: 'Син на Гази-Барадж, който управлявал до края на XIII век.' },
    { name: 'Мохаммед-Алам', page: 'Волжка България', description: 'Син на Тухчи-Исмаил, управлявал в началото на XIV век.' },
    { name: 'Касим Булак', page: 'Волжка България', description: 'Син на Галимбек, водил държавата през първата половина на XIV век.' },
    { name: 'Булуюм-Орду Мугаллим', page: 'Волжка България', description: 'Внук на Мохаммед-Алам, управлявал през първата половина на XIV век.' },
    { name: 'Мир-Махмуд', page: 'Волжка България', description: 'Син на Булук, управлявал през средата на XIV век.' },
    { name: 'Азан Хасан', page: 'Волжка България', description: 'Син на Мир-Махмуд, управлявал в края на XIV век.' },
    { name: 'Бий-Омар', page: 'Волжка България', description: 'Син на Азан Хасан, който управлявал през първата половина на XV век.' },
    { name: 'Галибей', page: 'Волжка България', description: 'Син на Бий-Омар, управлявал през средата на XV век.' },
    { name: 'Ябък-Мохаммед', page: 'Волжка България', description: 'Правнук на Булгом-Орду, управлявал в първата половина на XV век.' },
    { name: 'Габдел-Мумин', page: 'Волжка България', description: 'Син на Ябък-Мохаммед, управлявал към края на XV век.' },
    { name: 'Бураш-Барадж', page: 'Волжка България', description: 'Син на Габдел-Мумин, управлявал през началото на XVI век.' },
    { name: 'Мансур', page: 'Волжка България', description: 'Син на Бураш-Барадж, управлявал в първата половина на XVI век.' },
    { name: 'Ядкар Артан Кул-Ашраф', page: 'Волжка България', description: 'Син на Ал-Мохаммед, тричлен владетел през 1530-те и 1540-те години.' },
    { name: 'Мамед', page: 'Волжка България', description: 'Син на Мансур, управлявал в няколко кратки периода през XVI век.' },
    { name: 'Хусаин Байрам Гази', page: 'Волжка България', description: 'Син на Кул-Ашраф, управлявал през средата на XVI век.' },
    { name: 'Шейх-Гали Каргалъ', page: 'Волжка България', description: 'Син на Хусаин, управлявал до края на XVI век.' },
    { name: 'Аспарух', page: 'Първа българска държава', description: 'Основател на Първата българска държава на Балканите и ключова фигура в ранните български държавни структури.' },
    { name: 'Тервел', page: 'Първа българска държава', description: 'Владетел, който укрепва границите на държавата и участва в големи съюзи за защита на страната.' },
    { name: 'Кормесий', page: 'Първа българска държава', description: 'Счита се за наследник на Тервел, продължил укрепването на държавната структура.' },
    { name: 'Севар', page: 'Първа българска държава', description: 'Владетел, който ръководи страната през период на вътрешно и външно укрепване.' },
    { name: 'Кормисош (Вокил)', page: 'Първа българска държава', description: 'Владетел от рода Вокили, наследник на предишните владетели и пазител на стабилността.' },
    { name: 'Винех', page: 'Първа българска държава', description: 'Краткодеен владетел, важен за прехода към следващите управленчески етапи.' },
    { name: 'Телец', page: 'Първа българска държава', description: 'Владетел, чийто период е белязан от политически сътресения.' },
    { name: 'Борис I', page: 'Първа българска държава', description: 'Приема християнството и укрепва църковната организация и държавната идентичност.' },
    { name: 'Иван Владислав', page: 'Първа българска държава', description: 'Последен значим владетел на Първата българска държава, водещ борба за запазване на независимостта.' },
    { name: 'Петър IV', page: 'Втора българска държава', description: 'Началник на въстанието и първият владетел на Втората българска държава.' },
    { name: 'Иван Асен I', page: 'Втора българска държава', description: 'Организира държавните структури и първите успешни дипломатически контакти.' },
    { name: 'Калоян', page: 'Втора българска държава', description: 'Разширява държавата чрез военни кампании и международно признание.' },
    { name: 'Борил', page: 'Втора българска държава', description: 'Наследник на Калоян, преследва възстановяване на териториите при напрежение.' },
    { name: 'Иван Асен II', page: 'Втора българска държава', description: 'Един от най-силните владетели на държавата, който разширява границите и укрепва авторитета.' },
    { name: 'Калимент I', page: 'Втора българска държава', description: 'Запазва относителна стабилност след Иван Асен II.' },
    { name: 'Михаил II Асен', page: 'Втора българска държава', description: 'Баланс между дипломация и краткосрочни съюзи в труден период.' },
    { name: 'Калоян II', page: 'Втора българска държава', description: 'Краткодеен владетел по време на вътрешни борби.' },
    { name: 'Константин Тих', page: 'Втора българска държава', description: 'Дългогодишен владетел, който работи за възстановяване на авторитета на държавата.' },
    { name: 'Ивайло', page: 'Втора българска държава', description: 'Водач на въстание, възцарен от народните сили и символ на промяната.' },
    { name: 'Георги I Тертер', page: 'Втора българска държава', description: 'Възстановява ред след бурен период и обновява контактите със съседите.' },
    { name: 'Теодор Светослав', page: 'Втора българска държава', description: 'Възстановява териториалното влияние и засилва централната власт.' },
    { name: 'Георги II Тертер', page: 'Втора българска държава', description: 'Краток престой на трона, белязан от интриги и недоволство.' },
    { name: 'Михаил III Шишман', page: 'Втора българска държава', description: 'Решителен владетел, стремящ се да възстанови влиянието на държавата.' },
    { name: 'Иван Стефан', page: 'Втора българска държава', description: 'Краткотраен владетел, възкачил се в труден период.' },
    { name: 'Иван Александър', page: 'Втора българска държава', description: 'Просъществувал дълго управител, който укрепва администрацията и културния живот.' },
    { name: 'Иван Срацимир', page: 'Втора българска държава', description: 'Управлява в северозападната част на държавата и защитава собствената си територия.' },
    { name: 'Иван Шишман', page: 'Втора българска държава', description: 'Последният голям владетел на Втората българска държава в Търново.' },
    { name: 'Терес I', page: 'Одриско Царство', description: 'Първият владетел, който обединява тракийските родове в централизирано царство.' },
    { name: 'Ситалк', page: 'Одриско Царство', description: 'Наследник на Терес I, укрепва мирните отношения и границите.' },
    { name: 'Севт I', page: 'Одриско Царство', description: 'Укрепва административната власт и разширява териториите на царството.' },
    { name: 'Севт II', page: 'Одриско Царство', description: 'Поддържа централизацията и защитата на търговските пътища.' },
    { name: 'Котис I', page: 'Одриско Царство', description: 'Укрепва военната и административна организация на царството.' },
    { name: 'Котис II', page: 'Одриско Царство', description: 'Сблъсква се с предизвикателства от външни сили и вътрешни съюзи.' },
    { name: 'Рафис', page: 'Одриско Царство', description: 'Последният значим владетел, опитал да запази единството на царството.' },
    { name: 'Амадок I', page: 'Одриско Царство', description: 'Укрепва отношенията между родовете и подсилва търговските връзки.' },
    { name: 'Севт III', page: 'Одриско Царство', description: 'По-известен за крепостните си укрепления и относителната автономия.' },
    { name: 'Берисад', page: 'Одриско Царство', description: 'Владетел в период на фрагментация, който се стреми да консервира властта чрез съюзи.' },
    { name: 'Керсоблепт', page: 'Одриско Царство', description: 'Управлявал източната част на царството по време на силни външни натиски.' },
    { name: 'Басараб I', page: 'Влашко', description: 'Първият владетел, който оформя Влашко като самостоятелна сила.' },
    { name: 'Никола Александру', page: 'Влашко', description: 'Разширява и укрепява съюзите със съседни владетели.' },
    { name: 'Мирче Старият', page: 'Влашко', description: 'Още един силен владетел, водил битки и укрепил градовете и манастирите.' },
    { name: 'Влад II Дракул', page: 'Влашко', description: 'Укрепва отбраната и свързва местната власт със западните бойни практики.' },
    { name: 'Влад III Цепеш', page: 'Влашко', description: 'Известен с твърдото си управление и защитата на земите от нашествия.' },
    { name: 'Раду Красивия', page: 'Влашко', description: 'Търси стабилност чрез умерено сътрудничество с мощни съседи.' },
    { name: 'Неагое Басараб', page: 'Влашко', description: 'Покровителства църквата и културата, насърчавайки българското книжовно дело.' },
    { name: 'Михаил Смелия', page: 'Влашко', description: 'Символ на стремежа за обединение и защита на българските и влашките земи.' },
    { name: 'Матея Басараб', page: 'Влашко', description: 'Символ на относителна стабилност и творческо развитие.' },
    { name: 'Константин Бранковяну', page: 'Влашко', description: 'Съчетава политически и културен авторитет с църковни строежи и книжовна подкрепа.' },
    { name: 'Александру Йоан Куза', page: 'Влашко', description: 'Поставя началото на административни реформи и модернизира институциите.' },
    { name: 'Пердик / Perdiccas I', page: 'Македонско Царство', description: 'Един от първите владетели, свързан с оформянето на местна власт около Бермион.' },
    { name: 'Аргаев / Argaeus I', page: 'Македонско Царство', description: 'Свързан с укрепване на религиозни и културни практики.' },
    { name: 'Филип I', page: 'Македонско Царство', description: 'Името му се появява сред ранните владетели с начало на по-стабилна организация.' },
    { name: 'Аероп / Aeropus I', page: 'Македонско Царство', description: 'Член на ранната династия, подпомагащ приемствеността на властта.' },
    { name: 'Алкет / Alcetas', page: 'Македонско Царство', description: 'Част от наследствената рамка, която поддържа властовия ред.' },
    { name: 'Амнтас I / Amyntas I', page: 'Македонско Царство', description: 'Първият владетел, за когото имаме относително надеждни сведения.' },
    { name: 'Александър I „Филоксен” / Alexander I', page: 'Македонско Царство', description: 'Укрепва външните контакти и участва в по-широки дипломатически процеси.' },
    { name: 'Пердик / Perdiccas II', page: 'Македонско Царство', description: 'Владетел, чийто период е белязан от интриги и военни конфликти.' },
    { name: 'Архелай / Archelaus I', page: 'Македонско Царство', description: 'Модернизира двора и насърчава строителството и артистите.' },
    { name: 'Оре́ст / Orestes', page: 'Македонско Царство', description: 'Непълнолетен владетел, чието управление е белязано от регенства и борби.' },
    { name: 'Аероп II / Aeropus II', page: 'Македонско Царство', description: 'Преходен владетел в объркан период от македонската история.' },
    { name: 'Амнтас II / Amyntas II', page: 'Македонско Царство', description: 'Краткотраен владетел от времето на бързи политически промени.' },
    { name: 'Паузаний / Pausanias', page: 'Македонско Царство', description: 'Кратък владетел, чийто период е фрагментарно описан от хронистите.' },
    { name: 'Амнтас III / Amyntas III', page: 'Македонско Царство', description: 'Успява да възстанови ред след бурни години и укрепва институциите.' },
    { name: 'Аргаев II / Argaeus II', page: 'Македонско Царство', description: 'Спорен претендент, подкрепян отвън в хаотичен период.' },
    { name: 'Александър II / Alexander II', page: 'Македонско Царство', description: 'Млад владетел с кратък и съдбоносен престой на трона.' },
    { name: 'Птолемей от Алорос / Ptolemy of Aloros', page: 'Македонско Царство', description: 'Регент, чиято роля често се свързва с ограничено монархическо влияние.' },
    { name: 'Пердик / Perdiccas III', page: 'Македонско Царство', description: 'Владетел, чиято смърт в битка предизвиква криза за наследството.' },
    { name: 'Амнтас IV / Amyntas IV', page: 'Македонско Царство', description: 'Формален наследник, който никога не успява да упражни пълна власт.' },
    { name: 'Филип II / Philip II', page: 'Македонско Царство', description: 'Реформира армията и държавата, подготвя я за велики завоевания.' },
    { name: 'Александър III „Велик” / Alexander III', page: 'Македонско Царство', description: 'Извършва мащабни завоевания, които променят хода на историята.' },
    { name: 'Филип III Аррхидай / Philip III Arrhidaeus', page: 'Македонско Царство', description: 'Номинален цар, пред който реалната власт е в ръцете на регенти и военачалници.' },
    { name: 'Александър IV', page: 'Македонско Царство', description: 'Млад наследник, чието управление е поставено под опеката на регенти.' },
    { name: 'Касандър / Cassander', page: 'Македонско Царство', description: 'Създава нова династия и установява контрол след убийството на старите наследници.' },
    { name: 'Филип IV / Philip IV', page: 'Македонско Царство', description: 'Кратък владетел, символ на слабата връзка между формална титла и реална власт.' },
    { name: 'Антипатър I / Antipater I', page: 'Македонско Царство', description: 'Още един краткотраен владетел по време на семейни борби за влияние.' },
    { name: 'Александър V / Alexander V', page: 'Македонско Царство', description: 'Троен владетел, чиито опити за запазване на властта са пречупени от външни отпор.' },
    { name: 'Деметрий I Полирот / Demetrius I Poliorcetes', page: 'Македонско Царство', description: 'Полководец, който се провъзгласява за владетел и използва армията си, за да утвърди властта си.' },
    { name: 'Пир / Pyrrhus of Epirus', page: 'Македонско Царство', description: 'Временен владетел, дошъл отвън и останал белязан от поне няколко битки.' },
    { name: 'Лизимах / Lysimachus', page: 'Македонско Царство', description: 'Контролира източните части на държавата, но не успява да запази цялата територия.' },
    { name: 'Птолемей Кераун / Ptolemy Ceraunus', page: 'Македонско Царство', description: 'Син на птолемейски владетел, който убива предишния монарх и управлява кратко.' },
    { name: 'Мелеагър / Meleager', page: 'Македонско Царство', description: 'Избран от армията, но управлява само няколко седмици.' },
    { name: 'Антипатър II Етезия / Antipater II Etesias', page: 'Македонско Царство', description: 'Краткотраен изборен цар в разгара на политическата криза.' },
    { name: 'Состен / Sosthenes', page: 'Македонско Царство', description: 'Действа като върховен командир, без да приема формалната царска титла.' },
    { name: 'Антигон II Гонат / Antigonus II Gonatas', page: 'Македонско Царство', description: 'Възстановява династичната линия и установява относителен ред след хаоса.' },
    { name: 'Антигон III Досон / Antigonus III Doson', page: 'Македонско Царство', description: 'Стабилизира държавата и подготвя я за нови конфликти с Рим.' },
    { name: 'Филип V / Philip V', page: 'Македонско Царство', description: 'Дългогодишен владетел, стремящ се да запази влиянието спрямо Рим.' },
    { name: 'Персей / Perseus', page: 'Македонско Царство', description: 'Последният крал от династията, побеждаван при Пидна и загубващ независимостта на страната.' },
    { name: 'Андрик / Andriscus', page: 'Македонско Царство', description: 'Твърди, че е син на Персей и възстановява кратко независимост пред римската намеса.' },
    { name: 'Псевдо-Алесандър / Pseudo-Alexander', page: 'Македонско Царство', description: 'Твърди, че е наследник на Персей и остава символ на последния опит за съпротива.' }
  ];

  function formatRulerCard(ruler) {
    return `
      <h2>${ruler.name}</h2>
      <p><strong>Източник:</strong> ${ruler.page}</p>
      <p>${ruler.description}</p>
    `;
  }

  function createRandomRulerWidget() {
    const header = document.getElementById('top');
    if (!header) return;

    const widget = document.createElement('div');
    widget.className = 'random-ruler-widget';
    widget.innerHTML = `
      <button type="button" class="random-ruler-button">Покажи случаен владетел</button>
      <div class="random-ruler-card" aria-live="polite">Натиснете бутона, за да видите случаен владетел и кратка информация за него.</div>
    `;

    header.appendChild(widget);

    const button = widget.querySelector('.random-ruler-button');
    const card = widget.querySelector('.random-ruler-card');

    button.addEventListener('click', () => {
      const randomIndex = Math.floor(Math.random() * randomRulers.length);
      const ruler = randomRulers[randomIndex];
      card.innerHTML = formatRulerCard(ruler);
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  if (!form || !input || !results || !article) {
    createRandomRulerWidget();
    return;
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function clearHighlights() {
    const highlighted = article.querySelectorAll('.search-highlight');
    highlighted.forEach((span) => {
      const parent = span.parentNode;
      parent.replaceChild(document.createTextNode(span.textContent), span);
      parent.normalize();
    });
  }

  function highlightMatches(query) {
    const regex = new RegExp(escapeRegExp(query), 'gi');
    const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT, null, false);
    let node;
    let matchCount = 0;

    while ((node = walker.nextNode())) {
      if (!node.parentNode || node.parentNode.closest('.search-highlight')) {
        continue;
      }
      const text = node.nodeValue;
      if (regex.test(text)) {
        matchCount += (text.match(regex) || []).length;
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        text.replace(regex, (match, index) => {
          fragment.appendChild(document.createTextNode(text.slice(lastIndex, index)));
          const highlight = document.createElement('span');
          highlight.className = 'search-highlight';
          highlight.textContent = match;
          fragment.appendChild(highlight);
          lastIndex = index + match.length;
        });
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
        node.parentNode.replaceChild(fragment, node);
      }
    }

    return matchCount;
  }

  function updateResults(count, query) {
    if (!query) {
      results.textContent = 'Въведете текст за търсене.';
      return;
    }
    if (count === 0) {
      results.textContent = `Няма намерени резултати за „${query}“.`; 
    } else {
      results.textContent = `Намерени ${count} резултата за „${query}“.`; 
      const firstHighlight = article.querySelector('.search-highlight');
      if (firstHighlight) {
        firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  function performSearch(event) {
    if (event) event.preventDefault();
    const query = input.value.trim();
    clearHighlights();
    if (!query) {
      updateResults(0, query);
      return;
    }
    const count = highlightMatches(query);
    updateResults(count, query);
  }

  function resetCurrentNav() {
    const currentNav = document.querySelectorAll('.mw-sidebar a.nav-button[aria-current="page"]');
    currentNav.forEach((link) => link.removeAttribute('aria-current'));
  }

  function activateNavLink(link) {
    if (!link) return;
    resetCurrentNav();
    link.setAttribute('aria-current', 'page');
  }

  function getHashFromHref(href) {
    const index = href.indexOf('#');
    return index >= 0 ? href.slice(index) : '';
  }

  function findNavLinkForHash(hash) {
    if (!hash) {
      return document.querySelector('.mw-sidebar a.nav-button[href="index.html"]');
    }
    const links = Array.from(document.querySelectorAll('.mw-sidebar a.nav-button'));
    return links.find((link) => getHashFromHref(link.getAttribute('href')) === hash);
  }

  function updateCurrentNavByHash() {
    const hash = window.location.hash;
    const matchingLink = findNavLinkForHash(hash);
    if (matchingLink) {
      activateNavLink(matchingLink);
      return;
    }
    if (!hash) {
      activateNavLink(document.querySelector('.mw-sidebar a.nav-button[href="index.html"]'));
    }
  }

  function initScrollSpy() {
    const sectionLinks = Array.from(document.querySelectorAll('.mw-sidebar a.nav-button[href*="#"]'));
    const sections = sectionLinks
      .map((link) => {
        const hash = getHashFromHref(link.getAttribute('href'));
        return hash ? document.getElementById(hash.slice(1)) : null;
      })
      .filter(Boolean);

    if (!sections.length) {
      updateCurrentNavByHash();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const activeLink = findNavLinkForHash(`#${visible.target.id}`);
        if (activeLink) {
          activateNavLink(activeLink);
        }
      },
      {
        rootMargin: '-30% 0px -55% 0px',
        threshold: [0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((section) => observer.observe(section));
    updateCurrentNavByHash();
    window.addEventListener('hashchange', updateCurrentNavByHash);
  }

  initScrollSpy();
  createRandomRulerWidget();

  form.addEventListener('submit', performSearch);
  input.addEventListener('input', function () {
    if (!input.value.trim()) {
      clearHighlights();
      updateResults(0, '');
    }
  });
  updateResults(0, '');
});
