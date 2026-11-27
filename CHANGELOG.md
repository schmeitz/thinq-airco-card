# Changelog

## 1.6.0 — 2026-11-27

A big update: a light look, three more languages, two new pictures, and the card now also fits a plain electric heater, so your whole climate dashboard looks alike.

### New
- **Light look**: choose "LG ThinQ (light)" as background for the light colours of the ThinQ app.
- **German, French and Spanish**: the card follows the language of the Home Assistant user. Corrections to the translations are welcome.
- **Humidity**: shown next to the room temperature when the unit reports it, or pick your own humidity sensor.
- **Power use on the tile**: switch on "Show power use on the tile" in the card settings to see the current consumption.
- **Console unit**: picture for LG console / low wall units, which blow upwards. Choose "Console (low wall unit)" as picture.
- **Electric heater**: choose "Electric heater" as picture for any heater with a climate entity (for example a smart plug with a generic thermostat). The card shows power, temperature and presets; the warmth glow is only visible while the heater is really heating.
- **Presets**: thermostats with presets (eco, comfort, away, …) get a preset row on the control screen.

### Improved
- The operation mode can no longer be opened when a device has only one mode.
- Thermostats with 0.1° steps use half-degree steps on the card, so the buttons stay usable.
- Power and energy sensors of smart plugs are found automatically for the *Useful features* tab.
- Simpler installation: the card is now in the HACS default list, no custom repository needed.

---

**Nederlands** — Een grote update: een lichte stijl, drie extra talen, twee nieuwe afbeeldingen, en de kaart past nu ook bij een gewone elektrische kachel, zodat je hele klimaatdashboard één geheel is.

- **Nieuw: lichte stijl** — kies "LG ThinQ (licht)" als achtergrond voor de lichte kleuren van de ThinQ-app.
- **Nieuw: Duits, Frans en Spaans** — de kaart volgt de taal van de Home Assistant-gebruiker.
- **Nieuw: luchtvochtigheid** — naast de kamertemperatuur als de airco die doorgeeft, of kies een eigen sensor.
- **Nieuw: stroomverbruik op de tegel** — zet "Stroomverbruik op de tegel tonen" aan in de instellingen van de kaart.
- **Nieuw: consolemodel** — afbeelding voor LG-consolemodellen (lage wandunits), die naar boven uitblazen. Kies "Consolemodel (lage wandunit)" als afbeelding.
- **Nieuw: elektrische kachel** — kies "Elektrische kachel" als afbeelding voor elke kachel met een climate-entiteit (bijvoorbeeld een slimme stekker met een generieke thermostaat). De kaart toont aan/uit, temperatuur en voorkeuzes; de warmtegloed zie je alleen als de kachel echt verwarmt.
- **Nieuw: voorkeuzes** — thermostaten met voorkeuzes (eco, comfort, afwezig, …) krijgen een regel "Voorkeuze" op het bedieningsscherm.
- **Verbeterd** — de bedieningsmodus is niet meer te openen als een apparaat maar één stand heeft.
- **Verbeterd** — thermostaten met stappen van 0,1° gebruiken op de kaart halve graden, zodat de knoppen bruikbaar blijven.
- **Verbeterd** — vermogen- en energiesensoren van slimme stekkers worden automatisch gevonden voor het tabblad *Nuttige functies*.
- **Verbeterd** — eenvoudiger installeren: de kaart staat nu in de standaardlijst van HACS.

## 1.5.2 — 2026-11-21

- Releases are always marked as latest

## 1.5.1 — 2026-11-21

- Fan speed dial: grey track, coloured only up to the selected speed (like the ThinQ app)
- Dutch fan labels as in the app (Laag, Med, Hoog)

## 1.5.0 — 2026-11-21

- Airflow sheet like the ThinQ app: Up/Down and Left/Right pictures with rays, arrow buttons and swing switches
- Fan speed sheet like the ThinQ app: horseshoe dial (drag or tap), − / + and Auto switch
- Phone layout: control screen and tiles fit 360 px wide screens

## 1.4.0 — 2026-11-21

- Visual editor: entity, name, layout, picture, background, language, temperature sensor and LG feature overrides
- New cards pick an LG (smartthinq_sensors) air conditioner automatically

## 1.3.0 — 2026-11-21

- Airflow sheet with pictograms per louvre position (up/down side view, left/right top view, swing fans)

## 1.2.0 — 2026-11-21

First public release.

- Tile in the style of the LG ThinQ overview, opens a control screen like the ThinQ device page
- Operation mode, target temperature, fan speed, airflow (up/down, left/right), sleep timer, jet mode
- *Useful features* tab: filter, power, energy, display light, Wi-Fi
- Looks: `lg`, `glass`, `theme`; wall unit or ceiling cassette picture
- Dutch and English (follows the Home Assistant user language, or `language:`)
- Dialogs open in the browser top layer, so they always fit the window
