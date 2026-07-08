// Supported-radio catalog for the /supported-radios page.
//
// This is curated from the FT8AF app's rig table
// (ft8af/app/src/main/assets/rigaddress.txt in patrickrb/FT8AF). CAT-mode
// variants of the same model (e.g. USB vs DATA-USB, U-DIG) are collapsed into a
// single model entry here — the app still exposes each variant in Settings.
// When the app adds a rig, add it to the matching group below.
//
// Model names are proper nouns and are NOT translated (see README "Do not
// translate"). Only the group labels and page chrome live in the i18n catalogs.

export const RADIO_GROUPS = [
  {
    brand: 'Icom',
    models: [
      'IC-703', 'IC-705', 'IC-706MKII', 'IC-706MKIIG', 'IC-707 (725A)',
      'IC-7000', 'IC-7100', 'IC-718', 'IC-7200', 'IC-725', 'IC-7300',
      'IC-7400', 'IC-7410', 'IC-746', 'IC-746PRO', 'IC-756PRO', 'IC-756PRO2',
      'IC-756PRO3', 'IC-7600', 'IC-7610', 'IC-7700', 'IC-775', 'IC-7800',
      'IC-7850', 'IC-7851', 'IC-78', 'IC-910H', 'IC-9100', 'IC-9700',
      'IC-R8600', 'ID-52A',
    ],
  },
  {
    brand: 'Yaesu',
    models: [
      'FT-450(D)', 'FT-817', 'FT-818', 'FT-847', 'FT-857', 'FT-891/991',
      'FT-897(D)', 'FT-950', 'FT-2000(D)', 'FT-710', 'FT-DX10', 'FT-DX101',
      'FT-DX (other series)',
    ],
  },
  {
    brand: 'Kenwood',
    models: ['TK-90', 'TS-440', 'TS-480', 'TS-570', 'TS-590', 'TS-2000'],
  },
  {
    brand: 'Xiegu',
    models: ['X5105', 'X108', 'X6100', 'X6200', 'G90S', 'G106C'],
  },
  {
    brand: 'Guohe',
    models: ['Q900', 'PMR-171'],
  },
  {
    brand: 'SDR, QRP &amp; more',
    models: [
      'Lab599 Discovery TX-500', 'Elecraft K3S / K3 / KX3 / KX2',
      'FlexRadio 6000 series', 'KN990', 'mcHF-QRP SDR', 'FX-4CR',
      'QRP Labs QDX', 'UA3REO Wolf SDR', '(tr)uSDX',
    ],
  },
];

// Total distinct models across every group — rendered in the page copy so the
// headline count stays in sync with the list automatically.
export const RADIO_COUNT = RADIO_GROUPS.reduce((n, g) => n + g.models.length, 0);
