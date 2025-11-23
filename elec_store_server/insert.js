import { v7 } from "uuid";
import connection from "./db/connection.js";

function insertCategory(id, name) {

    const data = [id, name];
    return connection.execute('insert into categories (id,name) value (?,?)', data)
}



function insertProduct(item, categoryId) {
    const data = [v7(), item, categoryId]
    return connection.execute('insert into products(id,name,category_id) values (?,?,?)', data)
}


function handlingData(data) {
    data = data.split('\n');
    let key = '';
    let records = {}
    data.map(record => {
        if (record.startsWith('_')) {
            key = record.slice(1, -1);
            return;
        }

        if (key) {
            if (records[key]) {
                records[key].push(record)
            } else {
                records[key] = [record]
            }
        }
    })
    return records;
}


const data = `_PVC Pipe & Fitting
Elec. PVC PIPE 20MM 1.8 THICK
Elec. PVC PIPE 25MM 1.9 THICK
Elec. PVC PIPE 32MM 2.5 THICK 
PIPE DIA 2" SCH 40 / 6 M 
PVC Coupling 20MM
PVC Coupling 25MM
PVC Coupling 32MM
PVC Coupling50MM
Coupling 2 INCH 10MM*160MM
PVC Adaptor 20MM
PVC Adaptor 25MM
PVC Adaptor 32MM
PVC Adaptor 20MM DOUBLE SIDE / ادابتر ملبوش 2 سنة
PVC Adaptor 25MM DOUBLE SIDE / ادابتر ملبوش 2 سنة
Male Adaptor 2 INCH
Elbow 2''×90 Elec.
Elbow 2''×45 Elec.
Solvent Cement Glue (0.50 KG)
Solvent Cement Glue (0.50KG)
7*7*4.7 cm with brass earth single box - thickness 1.1
7*7*4.7 cm with brass earth Douple box - thickness 1.1
7*7*4.7 cm with brass earth tripple box - thickness 1.1
7*7*4.7 cm without brass earth single box - thickness 1.1
7*14*4.7 cm with brass earth Douplex - thickness 1.1 
10*10*5.5 cm with brass earth - thickness 1.1
15*15*10 cm without brass earth - thickness 1.1
_LV Cables
LV Cable 4C*35mm2 CU/XLPE/PVC SEWEDY
LV Cable 4C*25mm2 CU/XLPE/PVC SEWEDY
LV Cable Yellow,Green -1C*16mm2 CU/PVC SEWEDY
LV Cable 4C*35mm2 CU/XLPE/PVC JEDDA
LV Cable 4C*25mm2 CU/XLPE/PVC JEDDA
LV Cable Yellow,Green -1C*16mm2 CU/PVC 
LV Insulated Wires
LV Insulated Wire 10 awg Red Colour /  SEWEDY
LV Insulated Wire 10 awg Yellow Colour   /  الفنار
LV Insulated Wire 10 awg Blue Colour   /  الفنار
LV Insulated Wire 10 awg Black Colour   /  SEWEDY
LV Insulated Wire 10 awg Y / G Colour   /  SEWEDY
LV Insulated Wire 12 awg Red Colour  /  SEWEDY
LV Insulated Wire 12 awg Yellow Colour   /  SEWEDY
LV Insulated Wire 12 awg Blue Colour   /  SEWEDY
LV Insulated Wire 12 awg Black Colour   /  SEWEDY
LV Insulated Wire 12 awg Y / G Colour   /  SEWEDY
LV Insulated Wire 14 awg Red Colour  /  SEWEDY
LV Insulated Wire 14 awg Yellow Colour   /  SEWEDY
LV Insulated Wire 14 awg Blue Colour   /  SEWEDY
LV Insulated Wire 14 awg Black Colour   /  SEWEDY
LV Insulated Wire 14 awg Y / G Colour   /  SEWEDY
LV Insulated Wire 10 awg Red Colour /  JEDDA
LV Insulated Wire 10 awg Yellow Colour /  JEDDA
LV Insulated Wire 10 awg Blue Colour  /  JEDDA
LV Insulated Wire 10 awg Black Colour  /  JEDDA
LV Insulated Wire 10 awg Y / G Colour /  JEDDA
LV Insulated Wire 12 awg Red Colour /  JEDDA
LV Insulated Wire 12 awg Yellow Colour  /  JEDDA
LV Insulated Wire 12 awg Blue Colour  /  JEDDA
LV Insulated Wire 12 awg Black Colour  /  JEDDA
LV Insulated Wire 12 awg Y / G Colour  /  JEDDA
LV Insulated Wire 14 awg Red Colour /  JEDDA
LV Insulated Wire 14 awg Yellow Colour  /  JEDDA
LV Insulated Wire 14 awg Blue Colour  /  JEDDA
LV Insulated Wire 14 awg Black Colour  /  JEDDA
LV Insulated Wire 14 awg Y / G Colour  /  JEDDA
LV Cable 4C*35mm2 CU/XLPE/PVC RIYADE
LV Cable 4C*25mm2 CU/XLPE/PVC RIYADE
LV Cable Yellow,Green -1C*16mm2 CU/PVC RIYADE
LV Insulated Wire 10 awg Red Colour /  RIYADE
LV Insulated Wire 10 awg Yellow Colour /  RIYADE
LV Insulated Wire 10 awg Blue Colour  /  RIYADE
LV Insulated Wire 10 awg Black Colour  /  RIYADE
LV Insulated Wire 10 awg Y / G Colour /  RIYADE
LV Insulated Wire 12 awg Red Colour /  RIYADE
LV Insulated Wire 12 awg Yellow Colour  /  RIYADE
LV Insulated Wire 12 awg Blue Colour  /  RIYADE
LV Insulated Wire 12 awg Black Colour  /  RIYADE
LV Insulated Wire 12 awg Y / G Colour  /  RIYADE
LV Insulated Wire 14 awg Red Colour /  RIYADE
LV Insulated Wire 14 awg Yellow Colour  /  RIYADE
LV Insulated Wire 14 awg Blue Colour  /  RIYADE
LV Insulated Wire 14 awg Black Colour  /  RIYADE
LV Insulated Wire 14 awg Y / G Colour  /  RIYADE
_Metal Flexible
Metal Flexible Conduits - 3/4"- Tabalsa
Metal Flexible Connectors - 3/4" - Tabalsa
Metal Liquid Tight Conduits - 3/4"- Tabalsa/بلاستيك 
Metal Liquid Tight Connectors - 3/4" - Tabalsaبلاستيك 
Steel Opened Cover (7*7)
_Socket Outlets
13A switched socket with neon  (Double pole) - (Steel-VP309ML)
Double 13A switched socket with neon (Double pole) - (Steel-VP310ML)
Satellite socket(Steel-VP-SAT01)
Water Proof cover(VP-WC01)-7*7
Water Proof cover-7*14
_Light Switches
1 Gang 1 Way Switch (Steel-VP801H1)
2 Gang 1 Way Switch(Steel-VP802H1)
3 Gang 1 Way Switch(Steel-VP803H1)
1 Gang 2 Way Switch(Steel-VP801H2)
2 Gang 2 Way Switch(Steel-VP802H2)
Double pole switch with LED(Steel-VP305L)20A 
Double pole switch with LED(Steel-VP345L)45A 
Bell Push Switch(Steel-VP-DB)
Gang intermediate Switch(Steel-VP801H4)1 
Connection unit (VP-113) 45A 
_Socket Outlets
13A switched socket with neon  (Double pole) - (Steel-VP309ML)
Double 13A switched socket with neon (Double pole) - (Steel-VP310ML)
Satellite socket(Steel-VP-SAT01)
Water Proof cover(VP-WC01)-7*7
Water Proof cover-7*14
Light Switches-3rd Fix
1 Gang 1 Way Switch (Steel-VP801H1)
2 Gang 1 Way Switch(Steel-VP802H1)
3 Gang 1 Way Switch(Steel-VP803H1)
1 Gang 2 Way Switch(Steel-VP801H2)
2 Gang 2 Way Switch(Steel-VP802H2)
Double pole switch with LED(Steel-VP305L)20A 
Double pole switch with LED(Steel-VP345L)45A 
Bell Push Switch(Steel-VP-DB)
Gang intermediate Switch(Steel-VP801H4)1 
Connection unit (VP-113) 45A 
Lighting fixtures-3rd Fix
Up / Down External Lighting Fixtures With 2 LED 
 Lamp 9W (Wall Mounted)
12W 6500K DOWLIGHT LED 150MM C/OUT 100-240V
LED LIGHT 60x60CM 40W 220V 6500K    
LED LIGHT 60x60CM    كلبسات
Test Lamp Holder
Test Lamp Bulb
Strip Light 7.5W 3000K 220V (1Roll-50M) Model-RTL-FPC-285-120L-3000K
Power Core  220V
Track Light FRAME (DOWN LIGHT)
Track Light With 2 LED Lamp
_Electrical KWH-Meter
Meter Wooden Frame 
KWH-Meter  box ( Enclosure ) 
MCCB -70Amp.
Smart KWH-Meter
SMDB Panel Boards-3rd Fix
MDB Panel صندوق
SMDB Pan Assembly.60A.75A.100A
SMDB Pan Assembly.40A.50A.100A
SMDB Door 
SMDB Cover 
Space Breaker
_Panel Boards-3rd Fix
36W Panel Enclosure صندوق
36W Pan Assembly.75A
36W Pan Assembly.60A
36W Pan Assembly.50A
36W Pan Assembly.40A
36W Cover and Door  
SP Miniature Breaker - MCB 10 Amp.
SP Miniature Breaker -  MCB 20 Amp.
SP Miniature Breaker -  MCB 32 Amp.
Hasas Breaker -  RCBO 20 Amp-30mamp
TP Miniature Breaker -  MCB 50 Amp.
TP Miniature Breaker -  MCB 20 Amp.
Space Breaker-Blank Spacer
_Panel Boards
48W Panel Enclosure صندوق
48W Pan Assembly.60A
48W Cover and Door  
_Isolators / Disconnect
32A 2P Isolator, W/P for Booster & Circulating Pump 
63A TP Isolator, W/P for Solar Water Heater
Legrand Timer 230V 50/60 HZ - 16 A 250V-24H
15*15 PVC W/P Box With Gland
_Grounding System
Soft Drawn Stranded Bare Copper Conductor 1C*16 mm2
Copper Bonded Earth Rod External Threaded 3/4" D=17.2 mm,L-3000mm
Earth Pit Concrete Inspection Pit
Rod to Cable Clamp (Type-G) 1" (25MM) 70-150 MM2 
Rod to Cable Clamp (Type-U) 1" (25MM)  70-150 MM2 
_Finishing Accessories
PVC Wire Numbering - CKT Number 2.5mm² from ( 0 : 0)
PVC Wire Numbering - CKT Number 2.5mm² from ( 0 : 1)
PVC Wire Numbering - CKT Number 2.5mm² from ( 0 : 2)
PVC Wire Numbering - CKT Number 2.5mm² from ( 0 : 3)
PVC Wire Numbering - CKT Number 2.5mm² from ( 0 : 4)
PVC Wire Numbering - CKT Number 2.5mm² from ( 0 : 5)
PVC Wire Numbering - CKT Number 2.5mm² from ( 0 : 6)
PVC Wire Numbering - CKT Number 2.5mm² from ( 0 : 7)
PVC Wire Numbering - CKT Number 2.5mm² from ( 0 : 8)
PVC Wire Numbering - CKT Number 2.5mm² from ( 0 : 9)
PVC Wire Numbering - CKT Number 2.5mm² from ( 0 : 9 )
Raychem heat shrinkable 12mm - Red Color
Raychem heat shrinkable 12mm - Yellow Color
Raychem heat shrinkable 12mm - Blue Color
Raychem heat shrinkable 12mm - Black Color
Raychem heat shrinkable 12mm - Y/G Color
Pin Type Lugs (4.00 - 6.00) mm² 
Pin Type Lugs 2.5 mm² 
Round Type Lugs 2.5 mm² 
Pin Type Lugs 16 mm² 
Pin Type Lugs 25 mm² 
Pin Type Lugs 35 mm² 
Cable Tie - 25 cm
Cable Tie - 30 cm
Insulation Tape Coulors
6 mm Screw-3cm-Silver Color
6 mm Screw-3cm - Black color
6 mm Screw-6cm - golden color
6 mm Screw-10cm - golden color
15 mm Self Drilling Screw-1.5cm - golden color
PVC Connector 16 MM
PVC Connector 2.5mm2 (10 MM)
LetraTag Label - Brother & Dymo
White Plastic Covers 20×20 cm
White Plastic Covers 15×15 cm
White Plastic Covers 10×10 cm
White Plastic Covers 7×7 cm
Consumable Materials 
Masking Tape - 2"
Nylon Rope 2.5 mm - Guide wire
Wire Lubricant
Spray Paint
Foam Spray to Fill Cracks
LABEL
مسمار حق تركيب ابواب LPG . LPF
صندوق خشب Wooden box
`

const records = handlingData(data);

async function insertData(records) {
    try {
        for (let record in records) {
            const categoryId = v7();
            await insertCategory(categoryId, record);
            for (let item of records[record]) {
                await insertProduct(item, categoryId);
        }
        }
    } catch (error) {
        console.log(error)
    }
}

insertData(records);

