import { useState, useRef, useCallback } from 'react'

const GOV_ENTITIES = [
  { id:'g001', name:'РњРёРЅРёСЃС‚РµСЂСЃС‚РІРѕ С„РёРЅР°РЅСЃРѕРІ', type:'РњРёРЅРёСЃС‚РµСЂСЃС‚РІРѕ', city:'РўР°С€РєРµРЅС‚', budget:45000, employees:3200, risk:22, sector:'Р¤РёРЅР°РЅСЃС‹', head:'Р”Р¶Р°РјС€РёРґ РљСѓС‡РєР°СЂРѕРІ', founded:1991 },
  { id:'g002', name:'РњРёРЅРёСЃС‚РµСЂСЃС‚РІРѕ СЌРєРѕРЅРѕРјРёРєРё', type:'РњРёРЅРёСЃС‚РµСЂСЃС‚РІРѕ', city:'РўР°С€РєРµРЅС‚', budget:12000, employees:1800, risk:18, sector:'Р­РєРѕРЅРѕРјРёРєР°', head:'Р›Р°Р·РёР· РљСѓРґСЂР°С‚РѕРІ', founded:1991 },
  { id:'g003', name:'РњРёРЅРёСЃС‚РµСЂСЃС‚РІРѕ Р·РґСЂР°РІРѕРѕС…СЂР°РЅРµРЅРёСЏ', type:'РњРёРЅРёСЃС‚РµСЂСЃС‚РІРѕ', city:'РўР°С€РєРµРЅС‚', budget:28000, employees:4500, risk:35, sector:'Р—РґСЂР°РІРѕРѕС…СЂР°РЅРµРЅРёРµ', head:'РђРјСЂРёР»Р»Рѕ РРЅРѕСЏС‚РѕРІ', founded:1991 },
  { id:'g004', name:'РњРёРЅРёСЃС‚РµСЂСЃС‚РІРѕ РЅР°СЂРѕРґРЅРѕРіРѕ РѕР±СЂР°Р·РѕРІР°РЅРёСЏ', type:'РњРёРЅРёСЃС‚РµСЂСЃС‚РІРѕ', city:'РўР°С€РєРµРЅС‚', budget:32000, employees:5200, risk:28, sector:'РћР±СЂР°Р·РѕРІР°РЅРёРµ', head:'РСЃРјРѕРёР» Р”Р¶СѓСЂР°Р·РѕРґР°', founded:1991 },
  { id:'g005', name:'РњРёРЅРёСЃС‚РµСЂСЃС‚РІРѕ РІС‹СЃС€РµРіРѕ РѕР±СЂР°Р·РѕРІР°РЅРёСЏ', type:'РњРёРЅРёСЃС‚РµСЂСЃС‚РІРѕ', city:'РўР°С€РєРµРЅС‚', budget:18000, employees:2400, risk:20, sector:'РћР±СЂР°Р·РѕРІР°РЅРёРµ', head:'РљРѕРЅРіСЂР°С‚Р±РѕР№ РЁР°СЂРёРїРѕРІ', founded:2017 },
  { id:'g006', name:'РњРёРЅРёСЃС‚РµСЂСЃС‚РІРѕ СЌРЅРµСЂРіРµС‚РёРєРё', type:'РњРёРЅРёСЃС‚РµСЂСЃС‚РІРѕ', city:'РўР°С€РєРµРЅС‚', budget:85000, employees:6800, risk:42, sector:'Р­РЅРµСЂРіРµС‚РёРєР°', head:'Р–РѕСЂР°Р±РµРє РњРёСЂР·Р°РјР°С…РјСѓРґРѕРІ', founded:2019 },
  { id:'g007', name:'РњРёРЅРёСЃС‚РµСЂСЃС‚РІРѕ С‚СЂР°РЅСЃРїРѕСЂС‚Р°', type:'РњРёРЅРёСЃС‚РµСЂСЃС‚РІРѕ', city:'РўР°С€РєРµРЅС‚', budget:24000, employees:3100, risk:30, sector:'РўСЂР°РЅСЃРїРѕСЂС‚', head:'РР»С…РѕРј РњР°С…РєР°РјРѕРІ', founded:1991 },
  { id:'g008', name:'РњРёРЅРёСЃС‚РµСЂСЃС‚РІРѕ СЃРµР»СЊСЃРєРѕРіРѕ С…РѕР·СЏР№СЃС‚РІР°', type:'РњРёРЅРёСЃС‚РµСЂСЃС‚РІРѕ', city:'РўР°С€РєРµРЅС‚', budget:15000, employees:2800, risk:38, sector:'РђРіСЂРѕ', head:'РђР·РёР· Р’РѕРёС‚РѕРІ', founded:1991 },
  { id:'g009', name:'РњРёРЅРёСЃС‚РµСЂСЃС‚РІРѕ С†РёС„СЂРѕРІС‹С… С‚РµС…РЅРѕР»РѕРіРёР№', type:'РњРёРЅРёСЃС‚РµСЂСЃС‚РІРѕ', city:'РўР°С€РєРµРЅС‚', budget:8500, employees:1200, risk:12, sector:'IT', head:'РЁРµСЂР·РѕРґ РЁРµСЂРјР°С‚РѕРІ', founded:2019 },
  { id:'g010', name:'РњРёРЅРёСЃС‚РµСЂСЃС‚РІРѕ СЋСЃС‚РёС†РёРё', type:'РњРёРЅРёСЃС‚РµСЂСЃС‚РІРѕ', city:'РўР°С€РєРµРЅС‚', budget:6200, employees:2100, risk:25, sector:'Р®СЃС‚РёС†РёСЏ', head:'РЃРєСѓС‚С…РѕРЅ РЎР°РіРґСѓР»Р»Р°РµРІР°', founded:1991 },
  { id:'g011', name:'Р¦РµРЅС‚СЂР°Р»СЊРЅС‹Р№ Р±Р°РЅРє РЈР·Р±РµРєРёСЃС‚Р°РЅР°', type:'Р РµРіСѓР»СЏС‚РѕСЂ', city:'РўР°С€РєРµРЅС‚', budget:0, employees:2800, risk:15, sector:'Р¤РёРЅР°РЅСЃС‹', head:'РњР°РјР°СЂРёР·Рѕ РќСѓСЂРјСѓСЂРѕРґРѕРІ', founded:1991 },
  { id:'g012', name:'Р“РѕСЃСѓРґР°СЂСЃС‚РІРµРЅРЅР°СЏ РЅР°Р»РѕРіРѕРІР°СЏ СЃР»СѓР¶Р±Р°', type:'Р РµРіСѓР»СЏС‚РѕСЂ', city:'РўР°С€РєРµРЅС‚', budget:0, employees:18000, risk:20, sector:'РќР°Р»РѕРіРё', head:'РЁРµСЂР·РѕРґ РљСѓРґР±РёРµРІ', founded:1991 },
  { id:'g013', name:'РўР°РјРѕР¶РµРЅРЅС‹Р№ РєРѕРјРёС‚РµС‚', type:'Р РµРіСѓР»СЏС‚РѕСЂ', city:'РўР°С€РєРµРЅС‚', budget:0, employees:9500, risk:45, sector:'РўР°РјРѕР¶РЅСЏ', head:'Р‘Р°С…РѕРґРёСЂ Р–Р°Р»РѕР»РѕРІ', founded:1991 },
  { id:'g014', name:'РђРЅС‚РёРјРѕРЅРѕРїРѕР»СЊРЅС‹Р№ РєРѕРјРёС‚РµС‚', type:'Р РµРіСѓР»СЏС‚РѕСЂ', city:'РўР°С€РєРµРЅС‚', budget:2800, employees:580, risk:18, sector:'РљРѕРЅРєСѓСЂРµРЅС†РёСЏ', head:'РљРѕРјРёР»Р¶РѕРЅ РљР°Р±РёР»РѕРІ', founded:1992 },
  { id:'g015', name:'РЎС‡С‘С‚РЅР°СЏ РїР°Р»Р°С‚Р°', type:'Р РµРіСѓР»СЏС‚РѕСЂ', city:'РўР°С€РєРµРЅС‚', budget:1500, employees:420, risk:10, sector:'РђСѓРґРёС‚', head:'РЈР»СѓРіР±РµРє РњСѓС…РёС‚РґРёРЅРѕРІ', founded:1994 },
  { id:'g016', name:'IT Park Uzbekistan', type:'Р“РѕСЃРїСЂРѕРіСЂР°РјРјР°', city:'РўР°С€РєРµРЅС‚', budget:3500, employees:450, risk:8, sector:'IT', head:'Р¤Р°СЂС…РѕРґ РР±СЂР°РіРёРјРѕРІ', founded:2019 },
  { id:'g017', name:'РђРіРµРЅС‚СЃС‚РІРѕ СЃС‚СЂР°С‚РµРіРёС‡РµСЃРєРёС… СЂРµС„РѕСЂРј', type:'РђРіРµРЅС‚СЃС‚РІРѕ', city:'РўР°С€РєРµРЅС‚', budget:4200, employees:320, risk:12, sector:'Р РµС„РѕСЂРјС‹', head:'РР±СЂРѕС…РёРј Р®СЃСѓРїРѕРІ', founded:2021 },
  { id:'g018', name:'Р¤РѕРЅРґ СЂРµРєРѕРЅСЃС‚СЂСѓРєС†РёРё Рё СЂР°Р·РІРёС‚РёСЏ', type:'Р¤РѕРЅРґ', city:'РўР°С€РєРµРЅС‚', budget:120000, employees:680, risk:25, sector:'Р¤РёРЅР°РЅСЃС‹', head:'Р­Р»РѕСЂ Р“Р°РЅРёРµРІ', founded:2006 },
  { id:'g019', name:'РђРіРµРЅС‚СЃС‚РІРѕ РїРѕ СЂР°Р·РІРёС‚РёСЋ СЂС‹РЅРєР° РєР°РїРёС‚Р°Р»Р°', type:'РђРіРµРЅС‚СЃС‚РІРѕ', city:'РўР°С€РєРµРЅС‚', budget:2100, employees:280, risk:15, sector:'Р¤РёРЅР°РЅСЃС‹', head:'РћС‚Р°Р±РµРє РќР°Р·Р°СЂРѕРІ', founded:2019 },
  { id:'g020', name:'РЈР·Р±РµРєРЅРµС„С‚РµРіР°Р·', type:'Р“Рџ', city:'РўР°С€РєРµРЅС‚', budget:0, employees:42000, risk:25, sector:'РќРµС„С‚СЊ Рё РіР°Р·', head:'Р‘Р°С…РѕРґРёСЂ РЎРёРґРёРєРѕРІ', founded:1992 },
  { id:'g021', name:'РҐРѕРєРёРјРёСЏС‚ РўР°С€РєРµРЅС‚Р°', type:'РҐРѕРєРёРјРёСЏС‚', city:'РўР°С€РєРµРЅС‚', budget:18000, employees:8500, risk:32, sector:'РЎР°РјРѕСѓРїСЂР°РІР»РµРЅРёРµ', head:'РЁР°РІРєР°С‚ РЈРјСѓСЂР·Р°РєРѕРІ', founded:1991 },
  { id:'g022', name:'РҐРѕРєРёРјРёСЏС‚ РЎР°РјР°СЂРєР°РЅРґСЃРєРѕР№ РѕР±Р»Р°СЃС‚Рё', type:'РҐРѕРєРёРјРёСЏС‚', city:'РЎР°РјР°СЂРєР°РЅРґ', budget:8500, employees:4200, risk:28, sector:'РЎР°РјРѕСѓРїСЂР°РІР»РµРЅРёРµ', head:'Р­СЂРєРёРЅ РўСѓСЂРґРёРјРѕРІ', founded:1991 },
  { id:'g023', name:'РҐРѕРєРёРјРёСЏС‚ Р¤РµСЂРіР°РЅСЃРєРѕР№ РѕР±Р»Р°СЃС‚Рё', type:'РҐРѕРєРёРјРёСЏС‚', city:'Р¤РµСЂРіР°РЅР°', budget:7200, employees:3800, risk:30, sector:'РЎР°РјРѕСѓРїСЂР°РІР»РµРЅРёРµ', head:'РҐР°Р№СЂРёРґРёРЅ РЎСѓР»С‚РѕРЅРѕРІ', founded:1991 },
  { id:'g024', name:'РҐРѕРєРёРјРёСЏС‚ РђРЅРґРёР¶Р°РЅСЃРєРѕР№ РѕР±Р»Р°СЃС‚Рё', type:'РҐРѕРєРёРјРёСЏС‚', city:'РђРЅРґРёР¶Р°РЅ', budget:6800, employees:3500, risk:35, sector:'РЎР°РјРѕСѓРїСЂР°РІР»РµРЅРёРµ', head:'РЁСѓС…СЂР°С‚ РђР±РґСѓСЂР°С…РјРѕРЅРѕРІ', founded:1991 },
  { id:'g025', name:'РҐРѕРєРёРјРёСЏС‚ Р‘СѓС…Р°СЂСЃРєРѕР№ РѕР±Р»Р°СЃС‚Рё', type:'РҐРѕРєРёРјРёСЏС‚', city:'Р‘СѓС…Р°СЂР°', budget:5500, employees:2900, risk:28, sector:'РЎР°РјРѕСѓРїСЂР°РІР»РµРЅРёРµ', head:'Р‘РѕС‚РёСЂ Р—Р°СЂРёРїРѕРІ', founded:1991 },
]

const TENDERS = [
  { id:'t001', entity:'g003', title:'Р—Р°РєСѓРїРєР° РјРµРґРѕР±РѕСЂСѓРґРѕРІР°РЅРёСЏ РґР»СЏ СЂР°Р№РѕРЅРЅС‹С… Р±РѕР»СЊРЅРёС†', amount:4500, company:'Global Trade Solutions', status:'Р—Р°РІРµСЂС€С‘РЅ', risk:85, year:2024, suspicious:true },
  { id:'t002', entity:'g004', title:'РЎС‚СЂРѕРёС‚РµР»СЊСЃС‚РІРѕ С€РєРѕР» РІ РўР°С€РєРµРЅС‚СЃРєРѕР№ РѕР±Р»Р°СЃС‚Рё', amount:12000, company:'Qurilish Invest', status:'РђРєС‚РёРІРЅС‹Р№', risk:35, year:2025, suspicious:false },
  { id:'t003', entity:'g001', title:'Р Р°Р·СЂР°Р±РѕС‚РєР° РЅР°Р»РѕРіРѕРІРѕР№ РёРЅС„РѕСЂРјР°С†РёРѕРЅРЅРѕР№ СЃРёСЃС‚РµРјС‹', amount:3200, company:'Infocom.uz', status:'Р—Р°РІРµСЂС€С‘РЅ', risk:12, year:2023, suspicious:false },
  { id:'t004', entity:'g009', title:'РРЅС„СЂР°СЃС‚СЂСѓРєС‚СѓСЂР° Р•РРЎРЈР Рќ', amount:8900, company:'EPAM Uzbekistan', status:'РђРєС‚РёРІРЅС‹Р№', risk:8, year:2025, suspicious:false },
  { id:'t005', entity:'g006', title:'Р РµРєРѕРЅСЃС‚СЂСѓРєС†РёСЏ СЌР»РµРєС‚СЂРѕСЃРµС‚РµР№ Р¤РµСЂРіР°РЅСЃРєРѕР№ РґРѕР»РёРЅС‹', amount:28000, company:'РЈР·Р±РµРєСЌРЅРµСЂРіРѕ', status:'Р—Р°РІРµСЂС€С‘РЅ', risk:30, year:2023, suspicious:false },
  { id:'t006', entity:'g013', title:'РџРѕСЃС‚Р°РІРєР° РґРѕСЃРјРѕС‚СЂРѕРІРѕРіРѕ РѕР±РѕСЂСѓРґРѕРІР°РЅРёСЏ', amount:6700, company:'Invest Capital UZ', status:'Р—Р°РІРµСЂС€С‘РЅ', risk:88, year:2024, suspicious:true },
  { id:'t007', entity:'g021', title:'Р‘Р»Р°РіРѕСѓСЃС‚СЂРѕР№СЃС‚РІРѕ СѓР»РёС† РўР°С€РєРµРЅС‚Р°', amount:15000, company:'Tashkent City Development', status:'РђРєС‚РёРІРЅС‹Р№', risk:28, year:2025, suspicious:false },
  { id:'t008', entity:'g008', title:'РџРѕСЃС‚Р°РІРєР° Р°РіСЂРѕС‚РµС…РЅРёРєРё РґР»СЏ С„РµСЂРјРµСЂРѕРІ', amount:9500, company:'РЈР·Р°РіСЂРѕСЌРєСЃРїРѕСЂС‚', status:'Р—Р°РІРµСЂС€С‘РЅ', risk:25, year:2024, suspicious:false },
  { id:'t009', entity:'g022', title:'Р РµСЃС‚Р°РІСЂР°С†РёСЏ РёСЃС‚РѕСЂРёС‡РµСЃРєРёС… РїР°РјСЏС‚РЅРёРєРѕРІ', amount:5200, company:'Silk Road Hotels', status:'РђРєС‚РёРІРЅС‹Р№', risk:12, year:2025, suspicious:false },
  { id:'t010', entity:'g016', title:'РЎС‚СЂРѕРёС‚РµР»СЊСЃС‚РІРѕ IT-РєР°РјРїСѓСЃР° Samarkand IT Park', amount:11000, company:'Samarkand IT Park', status:'РђРєС‚РёРІРЅС‹Р№', risk:10, year:2025, suspicious:false },
]
function riskColor(s: number) {
  if (s >= 70) return '#0a0a0a'
  if (s >= 40) return '#888888'
  if (s >= 20) return '#5a5a5a'
  return '#0a0a0a'
}
function riskLabel(s: number) {
  if (s >= 70) return 'РљР РРўРР§РќР«Р™'
  if (s >= 40) return 'Р’Р«РЎРћРљРР™'
  if (s >= 20) return 'РЎР Р•Р”РќРР™'
  return 'РќРР—РљРР™'
}
const TYPE_COLORS: Record<string,string> = {
  'РњРёРЅРёСЃС‚РµСЂСЃС‚РІРѕ':'#0a0a0a','Р РµРіСѓР»СЏС‚РѕСЂ':'#3a3a3a','РҐРѕРєРёРјРёСЏС‚':'#3a3a3a',
  'РђРіРµРЅС‚СЃС‚РІРѕ':'#8a8a8a','Р¤РѕРЅРґ':'#8a8a8a','Р“Рџ':'#8a8a8a','Р“РѕСЃРїСЂРѕРіСЂР°РјРјР°':'#8a8a8a',
}
const TYPES = ['Р’СЃРµ', ...[...new Set(GOV_ENTITIES.map(e => e.type))]]

// Logical connections between government entities for graph view
const GOV_CONNECTIONS: [string, string][] = [
  ['g001','g011'], // РњРёРЅР¤РёРЅ в†” Р¦Р‘
  ['g001','g002'], // РњРёРЅР¤РёРЅ в†” РњРёРЅР­РєРѕРј
  ['g001','g012'], // РњРёРЅР¤РёРЅ в†” РќР°Р»РѕРіРѕРІР°СЏ
  ['g001','g018'], // РњРёРЅР¤РёРЅ в†” Р¤РѕРЅРґ СЂРµРєРѕРЅСЃС‚СЂ.
  ['g002','g017'], // РњРёРЅР­РєРѕРј в†” РђРіРµРЅС‚СЃС‚РІРѕ СЂРµС„РѕСЂРј
  ['g002','g019'], // РњРёРЅР­РєРѕРј в†” РђРіРµРЅС‚СЃС‚РІРѕ СЂС‹РЅРєР°
  ['g011','g019'], // Р¦Р‘ в†” РђРіРµРЅС‚СЃС‚РІРѕ СЂС‹РЅРєР°
  ['g012','g013'], // РќР°Р»РѕРіРѕРІР°СЏ в†” РўР°РјРѕР¶РЅСЏ
  ['g012','g014'], // РќР°Р»РѕРіРѕРІР°СЏ в†” РђРЅС‚РёРјРѕРЅРѕРїРѕР»РёСЏ
  ['g015','g018'], // РЎС‡С‘С‚РЅР°СЏ РїР°Р»Р°С‚Р° в†” Р¤РѕРЅРґ
  ['g006','g020'], // РњРёРЅР­РЅРµСЂРіРµС‚РёРєРё в†” РЈР·Р±РµРєРЅРµС„С‚РµРіР°Р·
  ['g009','g016'], // РњРёРЅР¦РёС„СЂР° в†” IT Park
  ['g021','g022'], // РҐРѕРєРёРј РўР°С€РєРµРЅС‚Р° в†” РҐРѕРєРёРј РЎР°РјР°СЂРєР°РЅРґР°
  ['g022','g023'], // РҐРѕРєРёРј РЎР°РјР°СЂРєР°РЅРґР° в†” РҐРѕРєРёРј Р¤РµСЂРіР°РЅС‹
  ['g023','g024'], // РҐРѕРєРёРј Р¤РµСЂРіР°РЅС‹ в†” РҐРѕРєРёРј РђРЅРґРёР¶Р°РЅР°
  ['g024','g025'], // РҐРѕРєРёРј РђРЅРґРёР¶Р°РЅР° в†” РҐРѕРєРёРј Р‘СѓС…Р°СЂС‹
]

// Initial graph positions (5-column grid)
const GOV_INIT_POS: Record<string, {x:number;y:number}> = Object.fromEntries(
  GOV_ENTITIES.map((e, i) => {
    const cols = 5
    const col = i % cols
    const row = Math.floor(i / cols)
    return [e.id, { x: 90 + col * 155, y: 60 + row * 110 }]
  })
)

export default function Nexus() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('Р’СЃРµ')
  const [tab, setTab] = useState<'entities'|'tenders'|'graph'>('entities')
  const [selectedId, setSelectedId] = useState<string|null>(null)
  const [suspiciousOnly, setSuspiciousOnly] = useState(false)
  const [govNodePos, setGovNodePos] = useState<Record<string,{x:number;y:number}>>(GOV_INIT_POS)
  const [govZoom, setGovZoom] = useState(1)
  const [govDragId, setGovDragId] = useState<string|null>(null)
  const [govLastMouse, setGovLastMouse] = useState({ x:0, y:0 })
  const [govSelected, setGovSelected] = useState<string|null>(null)
  const govSvgRef = useRef<SVGSVGElement>(null)

  const handleGovNodeDown = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setGovDragId(id)
    setGovLastMouse({ x: e.clientX, y: e.clientY })
    setGovSelected(id)
  }, [])

  const handleGovSvgMove = useCallback((e: React.MouseEvent) => {
    if (!govDragId || !govSvgRef.current) return
    const rect = govSvgRef.current.getBoundingClientRect()
    const vbW = 900, vbH = 580
    const dx = (e.clientX - govLastMouse.x) * (vbW / rect.width) / govZoom
    const dy = (e.clientY - govLastMouse.y) * (vbH / rect.height) / govZoom
    setGovNodePos(pos => ({ ...pos, [govDragId]: { x: pos[govDragId].x + dx, y: pos[govDragId].y + dy } }))
    setGovLastMouse({ x: e.clientX, y: e.clientY })
  }, [govDragId, govLastMouse, govZoom])

  const handleGovSvgUp = useCallback(() => setGovDragId(null), [])

  const handleGovWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    setGovZoom(z => Math.min(3, Math.max(0.3, z * (e.deltaY < 0 ? 1.1 : 0.9))))
  }, [])

  const filteredEntities = GOV_ENTITIES.filter(e => {
    if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false
    if (typeFilter !== 'Р’СЃРµ' && e.type !== typeFilter) return false
    return true
  }).sort((a,b) => b.risk - a.risk)

  const filteredTenders = TENDERS.filter(t => {
    if (suspiciousOnly && !t.suspicious) return false
    if (search) {
      const ent = GOV_ENTITIES.find(e => e.id === t.entity)
      if (!t.title.toLowerCase().includes(search.toLowerCase()) && !ent?.name.toLowerCase().includes(search.toLowerCase())) return false
    }
    return true
  }).sort((a,b) => b.risk - a.risk)

  const selected = GOV_ENTITIES.find(e => e.id === selectedId)
  const entityTenders = selectedId ? TENDERS.filter(t => t.entity === selectedId) : []
  const suspicious = TENDERS.filter(t => t.suspicious).length
  const highRisk = GOV_ENTITIES.filter(e => e.risk >= 40).length

  const inp: React.CSSProperties = {
    background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.15)',
    borderRadius: 6, padding: '8px 12px', color: '#0a0a0a',
    fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', outline: 'none', cursor: 'pointer',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: 64 }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>

        <div style={{ padding: '28px 0 20px', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span className="status-dot" />
            <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.6rem', color: '#3a3a3a', letterSpacing: '0.18em' }}>NEXUS вЂ” GOVERNMENT INTELLIGENCE</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <h1 style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: '1.6rem', color: '#0a0a0a', letterSpacing: '0.06em' }}>Р“РћРЎРЈР”РђР РЎРўР’Р•РќРќР«Р• РЎРўР РЈРљРўРЈР Р«</h1>
            <div style={{ display: 'flex', gap: 24 }}>
              {[
                { label: 'РЎРўР РЈРљРўРЈР ', value: GOV_ENTITIES.length, color: '#3a3a3a' },
                { label: 'РўР•РќР”Р•Р РћР’', value: TENDERS.length, color: '#0a0a0a' },
                { label: 'РђРќРћРњРђР›РР™', value: suspicious, color: '#0a0a0a' },
                { label: 'Р’Р«РЎРћРљРР™ Р РРЎРљ', value: highRisk, color: '#888888' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: '1.4rem', color: s.color }}>{s.value}</div>
                  <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.52rem', color: '#8a8a8a', letterSpacing: '0.1em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 0, margin: '16px 0', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 7, overflow: 'hidden', width: 'fit-content' }}>
          {(['entities','tenders','graph'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '9px 24px', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.68rem', letterSpacing: '0.1em', cursor: 'pointer', border: 'none', transition: 'all 180ms', background: tab === t ? 'rgba(0,0,0,0.12)' : 'transparent', color: tab === t ? '#0a0a0a' : '#8a8a8a' }}>
              {t === 'entities' ? 'в—€ Р“РћРЎРЎРўР РЈРљРўРЈР Р«' : t === 'tenders' ? 'в‰Ў РўР•РќР”Р•Р Р«' : 'в—Ћ Р“Р РђР¤'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <input type="text" value={search} placeholder="РџРѕРёСЃРє..." onChange={e => setSearch(e.target.value)} style={{ ...inp, flex: '1 1 200px', minWidth: 160 }} />
          {tab === 'entities' && (
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={inp}>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          )}
          {tab === 'tenders' && (
            <button onClick={() => setSuspiciousOnly(v => !v)} style={{ padding: '8px 14px', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.65rem', cursor: 'pointer', border: '1px solid ' + (suspiciousOnly ? '#0a0a0a' : 'rgba(0,0,0,0.15)'), borderRadius: 6, background: suspiciousOnly ? 'rgba(0,0,0,0.08)' : 'transparent', color: suspiciousOnly ? '#0a0a0a' : '#8a8a8a', transition: 'all 180ms' }}>
              вљ  РўРћР›Р¬РљРћ РђРќРћРњРђР›РР
            </button>
          )}
          <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.6rem', color: '#8a8a8a', marginLeft: 'auto' }}>{tab === 'entities' ? filteredEntities.length + ' / ' + GOV_ENTITIES.length : filteredTenders.length + ' / ' + TENDERS.length} Р·Р°РїРёСЃРµР№</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selected && tab === 'entities' ? '1fr 360px' : '1fr', gap: 16, paddingBottom: 40 }}>

          {tab === 'entities' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1.2fr 1fr 1.2fr', padding: '0 16px', background: '#f5f5f3', borderBottom: '1px solid rgba(0,0,0,0.12)' }}>
                {['РЎРўР РЈРљРўРЈР Рђ','РўРРџ','Р‘Р®Р”Р–Р•Рў $Рњ','РЎРћРўР РЈР”Рќ.','Р РРЎРљ'].map((col,i) => (
                  <div key={i} style={{ padding: '11px 0', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.58rem', color: '#8a8a8a', letterSpacing: '0.1em' }}>{col}</div>
                ))}
              </div>
              <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 340px)' }}>
                {filteredEntities.map((entity, idx) => (
                  <div key={entity.id} onClick={() => setSelectedId(selectedId === entity.id ? null : entity.id)}
                    style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1.2fr 1fr 1.2fr', padding: '0 16px', borderBottom: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'background 150ms', background: selectedId === entity.id ? 'rgba(0,0,0,0.07)' : idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.012)' }}
                    onMouseEnter={e => { if (selectedId !== entity.id) (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.04)' }}
                    onMouseLeave={e => { if (selectedId !== entity.id) (e.currentTarget as HTMLElement).style.background = idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.012)' }}
                  >
                    <div style={{ padding: '11px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: entity.risk >= 40 ? riskColor(entity.risk) : 'transparent', flexShrink: 0, boxShadow: 'none' }} />
                      <div>
                        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.88rem', color: '#0a0a0a', lineHeight: 1.2 }}>{entity.name}</div>
                        <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.56rem', color: '#8a8a8a', marginTop: 2 }}>{entity.city} В· {entity.sector}</div>
                      </div>
                    </div>
                    <div style={{ padding: '11px 0', display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.62rem', color: TYPE_COLORS[entity.type] || '#8a8a8a', background: (TYPE_COLORS[entity.type] || '#8a8a8a') + '14', padding: '2px 8px', borderRadius: 4 }}>{entity.type}</span>
                    </div>
                    <div style={{ padding: '11px 0', display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.8rem', color: entity.budget > 0 ? '#0a0a0a' : '#8a8a8a' }}>{entity.budget > 0 ? '$' + entity.budget.toLocaleString() : 'вЂ”'}</span>
                    </div>
                    <div style={{ padding: '11px 0', display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.8rem', color: '#3a3a3a' }}>{entity.employees.toLocaleString()}</span>
                    </div>
                    <div style={{ padding: '11px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 4, background: 'rgba(0,0,0,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: entity.risk + '%', height: '100%', background: riskColor(entity.risk), borderRadius: 2 }} />
                      </div>
                      <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.75rem', fontWeight: 700, color: riskColor(entity.risk), width: 24, textAlign: 'right', flexShrink: 0 }}>{entity.risk}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'tenders' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.5fr 1fr 0.8fr 1fr', padding: '0 16px', background: '#f5f5f3', borderBottom: '1px solid rgba(0,0,0,0.12)' }}>
                {['РўР•РќР”Р•Р ','РРЎРџРћР›РќРРўР•Р›Р¬','РЎРЈРњРњРђ $Рњ','Р“РћР”','Р РРЎРљ'].map((col,i) => (
                  <div key={i} style={{ padding: '11px 0', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.58rem', color: '#8a8a8a', letterSpacing: '0.1em' }}>{col}</div>
                ))}
              </div>
              <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 340px)' }}>
                {filteredTenders.map((tender, idx) => {
                  const entity = GOV_ENTITIES.find(e => e.id === tender.entity)
                  return (
                    <div key={tender.id} style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.5fr 1fr 0.8fr 1fr', padding: '0 16px', borderBottom: '1px solid rgba(0,0,0,0.05)', background: tender.suspicious ? 'rgba(0,0,0,0.04)' : idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.012)', borderLeft: tender.suspicious ? '2px solid #0a0a0a' : '2px solid transparent' }}>
                      <div style={{ padding: '12px 0 12px 8px' }}>
                        {tender.suspicious && <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.52rem', color: '#0a0a0a', marginBottom: 3, letterSpacing: '0.08em' }}>вљ  РђРќРћРњРђР›РРЇ</div>}
                        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.86rem', color: '#0a0a0a', lineHeight: 1.3, marginBottom: 3 }}>{tender.title}</div>
                        <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.56rem', color: '#8a8a8a' }}>{entity?.name}</div>
                      </div>
                      <div style={{ padding: '12px 0', display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: tender.suspicious ? '#888888' : '#3a3a3a' }}>{tender.company}</span>
                      </div>
                      <div style={{ padding: '12px 0', display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.82rem', fontWeight: 600, color: '#0a0a0a' }}>{tender.amount.toLocaleString()}</span>
                      </div>
                      <div style={{ padding: '12px 0', display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.78rem', color: '#8a8a8a' }}>{tender.year}</span>
                      </div>
                      <div style={{ padding: '12px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 4, background: 'rgba(0,0,0,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ width: tender.risk + '%', height: '100%', background: riskColor(tender.risk), borderRadius: 2 }} />
                        </div>
                        <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.75rem', fontWeight: 700, color: riskColor(tender.risk), width: 24, textAlign: 'right', flexShrink: 0 }}>{tender.risk}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {selected && tab === 'entities' && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(0,0,0,0.15)', borderRadius: 8, padding: 20, alignSelf: 'start', position: 'sticky', top: 84 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.58rem', color: '#3a3a3a', letterSpacing: '0.15em' }}>Р”РћРЎР¬Р• РЎРўР РЈРљРўРЈР Р«</span>
                <button onClick={() => setSelectedId(null)} style={{ background: 'none', border: 'none', color: '#8a8a8a', cursor: 'pointer', fontSize: '1rem' }}>вњ•</button>
              </div>
              <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.56rem', color: TYPE_COLORS[selected.type] || '#8a8a8a', background: (TYPE_COLORS[selected.type] || '#8a8a8a') + '14', padding: '2px 8px', borderRadius: 4, display: 'inline-block', marginBottom: 10 }}>{selected.type}</span>
              <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#0a0a0a', marginBottom: 4, lineHeight: 1.3 }}>{selected.name}</h3>
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.6rem', color: '#8a8a8a', marginBottom: 16 }}>{selected.city} В· РћСЃРЅ. {selected.founded}</div>
              <div style={{ background: riskColor(selected.risk) + '0E', border: '1px solid ' + riskColor(selected.risk) + '28', borderRadius: 8, padding: '12px 14px', marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                  <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.56rem', color: '#8a8a8a', letterSpacing: '0.1em' }}>Р РРЎРљ-РРќР”Р•РљРЎ</span>
                  <span style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: '1.5rem', color: riskColor(selected.risk) }}>{selected.risk}</span>
                </div>
                <div style={{ height: 5, background: 'rgba(0,0,0,0.08)', borderRadius: 3, overflow: 'hidden', marginBottom: 5 }}>
                  <div style={{ width: selected.risk + '%', height: '100%', background: riskColor(selected.risk), borderRadius: 3 }} />
                </div>
                <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.58rem', color: riskColor(selected.risk) }}>{riskLabel(selected.risk)}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                {[
                  { k:'Р‘Р®Р”Р–Р•Рў', v: selected.budget > 0 ? '$' + selected.budget.toLocaleString() + 'Рњ' : 'Рќ/Р”' },
                  { k:'РЎРћРўР РЈР”РќРРљР', v: selected.employees.toLocaleString() },
                  { k:'РЎР•РљРўРћР ', v: selected.sector },
                  { k:'Р РЈРљРћР’РћР”РРўР•Р›Р¬', v: selected.head },
                ].map(m => (
                  <div key={m.k} style={{ background: 'rgba(0,0,0,0.03)', borderRadius: 6, padding: '9px 11px' }}>
                    <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.52rem', color: '#8a8a8a', letterSpacing: '0.08em', marginBottom: 4 }}>{m.k}</div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.82rem', color: '#0a0a0a' }}>{m.v}</div>
                  </div>
                ))}
              </div>
              {entityTenders.length > 0 && (
                <div>
                  <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.56rem', color: '#8a8a8a', letterSpacing: '0.1em', marginBottom: 8 }}>РўР•РќР”Р•Р Р« ({entityTenders.length})</div>
                  {entityTenders.map(t => (
                    <div key={t.id} style={{ padding: '9px 10px', background: t.suspicious ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.03)', borderRadius: 6, marginBottom: 6, borderLeft: t.suspicious ? '2px solid #0a0a0a' : '2px solid transparent' }}>
                      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#0a0a0a', marginBottom: 5, lineHeight: 1.3 }}>{t.title}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.62rem', color: '#0a0a0a' }}>${t.amount.toLocaleString()}Рњ</span>
                        <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.6rem', color: riskColor(t.risk), fontWeight: 700 }}>СЂРёСЃРє {t.risk}{t.suspicious ? ' вљ ' : ''}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'graph' && (() => {
            const selEnt = govSelected ? GOV_ENTITIES.find(e => e.id === govSelected) : null
            const vbW = 900, vbH = 580, cx = vbW / 2, cy = vbH / 2
            return (
              <div style={{ display: 'grid', gridTemplateColumns: selEnt ? '1fr 300px' : '1fr', gap: 16 }}>
                <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
                  {/* Legend */}
                  <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10, background: '#ffffff', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 6, padding: '8px 12px' }}>
                    {[['#0a0a0a','РњРёРЅРёСЃС‚РµСЂСЃС‚РІРѕ'],['#3a3a3a','Р РµРіСѓР»СЏС‚РѕСЂ'],['#3a3a3a','РҐРѕРєРёРјРёСЏС‚'],['#8a8a8a','РџСЂРѕС‡РёРµ']].map(([c,l]) => (
                      <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
                        <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.55rem', color: '#3a3a3a' }}>{l}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: 6, fontFamily: 'Share Tech Mono, monospace', fontSize: '0.52rem', color: '#8a8a8a' }}>Scroll: zoom В· Drag: move</div>
                  </div>
                  <svg ref={govSvgRef} width="100%" viewBox={`0 0 ${vbW} ${vbH}`} style={{ display: 'block', cursor: govDragId ? 'grabbing' : 'default' }}
                    onMouseMove={handleGovSvgMove} onMouseUp={handleGovSvgUp} onMouseLeave={handleGovSvgUp}
                    onWheel={handleGovWheel}>
                    <g transform={`translate(${cx},${cy}) scale(${govZoom}) translate(${-cx},${-cy})`}>
                      {/* Edges */}
                      {GOV_CONNECTIONS.map(([aid, bid]) => {
                        const a = govNodePos[aid], b = govNodePos[bid]
                        if (!a || !b) return null
                        return <line key={aid+'-'+bid} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(0,0,0,0.18)" strokeWidth="1.5" />
                      })}
                      {/* Nodes */}
                      {GOV_ENTITIES.map(e => {
                        const p = govNodePos[e.id]
                        if (!p) return null
                        const col = TYPE_COLORS[e.type] || '#8a8a8a'
                        const isSel = govSelected === e.id
                        return (
                          <g key={e.id} onMouseDown={ev => handleGovNodeDown(ev, e.id)} style={{ cursor: 'grab' }}>
                            <circle cx={p.x} cy={p.y} r={isSel ? 14 : 10} fill={col} opacity={0.9} stroke={isSel ? '#d4d4d0' : col} strokeWidth={isSel ? 2 : 1} />
                            <text x={p.x} y={p.y + 22} textAnchor="middle" style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, fill: '#3a3a3a', pointerEvents: 'none' }}>{e.name.split(' ').slice(-1)[0].slice(0, 12)}</text>
                          </g>
                        )
                      })}
                    </g>
                  </svg>
                </div>
                {selEnt && (
                  <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(0,0,0,0.15)', borderRadius: 8, padding: 20, alignSelf: 'start' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                      <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.56rem', color: '#3a3a3a', letterSpacing: '0.15em' }}>Р”РћРЎР¬Р• РЎРўР РЈРљРўРЈР Р«</span>
                      <button onClick={() => setGovSelected(null)} style={{ background: 'none', border: 'none', color: '#8a8a8a', cursor: 'pointer', fontSize: '1rem' }}>вњ•</button>
                    </div>
                    <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.56rem', color: TYPE_COLORS[selEnt.type] || '#8a8a8a', background: (TYPE_COLORS[selEnt.type] || '#8a8a8a') + '14', padding: '2px 8px', borderRadius: 4, display: 'inline-block', marginBottom: 10 }}>{selEnt.type}</span>
                    <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#0a0a0a', marginBottom: 4, lineHeight: 1.3 }}>{selEnt.name}</h3>
                    <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.58rem', color: '#8a8a8a', marginBottom: 14 }}>{selEnt.city} В· РћСЃРЅ. {selEnt.founded}</div>
                    <div style={{ background: riskColor(selEnt.risk) + '0E', border: '1px solid ' + riskColor(selEnt.risk) + '28', borderRadius: 8, padding: '10px 12px', marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.56rem', color: '#8a8a8a' }}>Р РРЎРљ-РРќР”Р•РљРЎ</span>
                        <span style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: '1.4rem', color: riskColor(selEnt.risk) }}>{selEnt.risk}</span>
                      </div>
                      <div style={{ height: 5, background: 'rgba(0,0,0,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: selEnt.risk + '%', height: '100%', background: riskColor(selEnt.risk), borderRadius: 3 }} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                      {[{ k:'Р‘Р®Р”Р–Р•Рў', v: selEnt.budget > 0 ? '$'+selEnt.budget.toLocaleString()+'Рњ' : 'Рќ/Р”' }, { k:'РЎРћРўР РЈР”РќРРљР', v: selEnt.employees.toLocaleString() }].map(m => (
                        <div key={m.k} style={{ background: 'rgba(0,0,0,0.03)', borderRadius: 6, padding: '9px 11px' }}>
                          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.52rem', color: '#8a8a8a', marginBottom: 4 }}>{m.k}</div>
                          <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.82rem', color: '#0a0a0a' }}>{m.v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.52rem', color: '#8a8a8a', marginBottom: 4 }}>Р РЈРљРћР’РћР”РРўР•Р›Р¬</div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#0a0a0a', marginBottom: 14 }}>{selEnt.head}</div>
                    {(() => {
                      const conns = GOV_CONNECTIONS.filter(([a,b]) => a === govSelected || b === govSelected).map(([a,b]) => a === govSelected ? b : a)
                      return conns.length > 0 ? (
                        <div>
                          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.52rem', color: '#8a8a8a', marginBottom: 8 }}>РЎР’РЇР—Р ({conns.length})</div>
                          {conns.map(tid => {
                            const t = GOV_ENTITIES.find(x => x.id === tid)
                            return t ? (
                              <div key={tid} onClick={() => setGovSelected(tid)} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 10px', marginBottom: 4, background: 'rgba(0,0,0,0.03)', borderRadius: 6, cursor: 'pointer' }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.08)'}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'}>
                                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#0a0a0a' }}>{t.name.split(' ').slice(0,3).join(' ')}</span>
                                <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.62rem', color: TYPE_COLORS[t.type] || '#8a8a8a' }}>{t.type.slice(0,4)}</span>
                              </div>
                            ) : null
                          })}
                        </div>
                      ) : null
                    })()}
                  </div>
                )}
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}



