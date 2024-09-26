import Config from 'src/config';
import EnvironmentEnum from 'src/enums/environment';

import DefaultProfilePicture from 'src/css/imgs/boom-imgs/profile/default-profile-picture.png';
import Sg from 'src/css/imgs/boom-imgs/countries/sg.png';
import Ph from 'src/css/imgs/boom-imgs/countries/ph.png';
import Jp from 'src/css/imgs/boom-imgs/countries/jp.png';
import Lt from 'src/css/imgs/boom-imgs/countries/lt.png';
import Ee from 'src/css/imgs/boom-imgs/countries/ee.png';
import Us from 'src/css/imgs/boom-imgs/countries/us.png';
import Nz from 'src/css/imgs/boom-imgs/countries/nz.png';

const countryImages = {
  SG: Sg,
  PH: Ph,
  JP: Jp,
  LT: Lt,
  EE: Ee,
  US: Us,
  NZ: Nz,
};

const countries = [
  {
    label: 'Afghanistan',
    flag: '🇦🇫',
    code: 'AF',
  },
  {
    label: 'Åland Islands',
    flag: '🇦🇽',
    code: 'AX',
  },
  {
    label: 'Albania',
    flag: '🇦🇱',
    code: 'AL',
  },
  {
    label: 'Algeria',
    flag: '🇩🇿',
    code: 'DZ',
  },
  {
    label: 'American Samoa',
    flag: '🇦🇸',
    code: 'AS',
  },
  {
    label: 'Andorra',
    flag: '🇦🇩',
    code: 'AD',
  },
  {
    label: 'Angola',
    flag: '🇦🇴',
    code: 'AO',
  },
  {
    label: 'Anguilla',
    flag: '🇦🇮',
    code: 'AI',
  },
  {
    label: 'Antarctica',
    flag: '🇦🇶',
    code: 'AQ',
  },
  {
    label: 'Antigua and Barbuda',
    flag: '🇦🇬',
    code: 'AG',
  },
  {
    label: 'Argentina',
    flag: '🇦🇷',
    code: 'AR',
  },
  {
    label: 'Armenia',
    flag: '🇦🇲',
    code: 'AM',
  },
  {
    label: 'Aruba',
    flag: '🇦🇼',
    code: 'AW',
  },
  {
    label: 'Australia',
    flag: '🇦🇺',
    code: 'AU',
  },
  {
    label: 'Austria',
    flag: '🇦🇹',
    code: 'AT',
  },
  {
    label: 'Azerbaijan',
    flag: '🇦🇿',
    code: 'AZ',
  },
  {
    label: 'Bahamas',
    flag: '🇧🇸',
    code: 'BS',
  },
  {
    label: 'Bahrain',
    flag: '🇧🇭',
    code: 'BH',
  },
  {
    label: 'Bangladesh',
    flag: '🇧🇩',
    code: 'BD',
  },
  {
    label: 'Barbados',
    flag: '🇧🇧',
    code: 'BB',
  },
  {
    label: 'Belarus',
    flag: '🇧🇾',
    code: 'BY',
  },
  {
    label: 'Belgium',
    flag: '🇧🇪',
    code: 'BE',
  },
  {
    label: 'Belize',
    flag: '🇧🇿',
    code: 'BZ',
  },
  {
    label: 'Benin',
    flag: '🇧🇯',
    code: 'BJ',
  },
  {
    label: 'Bermuda',
    flag: '🇧🇲',
    code: 'BM',
  },
  {
    label: 'Bhutan',
    flag: '🇧🇹',
    code: 'BT',
  },
  {
    label: 'Bolivia, Plurinational State of bolivia',
    flag: '🇧🇴',
    code: 'BO',
  },
  {
    label: 'Bosnia and Herzegovina',
    flag: '🇧🇦',
    code: 'BA',
  },
  {
    label: 'Botswana',
    flag: '🇧🇼',
    code: 'BW',
  },
  {
    label: 'Bouvet Island',
    flag: '🇧🇻',
    code: 'BV',
  },
  {
    label: 'Brazil',
    flag: '🇧🇷',
    code: 'BR',
  },
  {
    label: 'British Indian Ocean Territory',
    flag: '🇮🇴',
    code: 'IO',
  },
  {
    label: 'Brunei Darussalam',
    flag: '🇧🇳',
    code: 'BN',
  },
  {
    label: 'Bulgaria',
    flag: '🇧🇬',
    code: 'BG',
  },
  {
    label: 'Burkina Faso',
    flag: '🇧🇫',
    code: 'BF',
  },
  {
    label: 'Burundi',
    flag: '🇧🇮',
    code: 'BI',
  },
  {
    label: 'Cambodia',
    flag: '🇰🇭',
    code: 'KH',
  },
  {
    label: 'Cameroon',
    flag: '🇨🇲',
    code: 'CM',
  },
  {
    label: 'Canada',
    flag: '🇨🇦',
    code: 'CA',
  },
  {
    label: 'Cape Verde',
    flag: '🇨🇻',
    code: 'CV',
  },
  {
    label: 'Cayman Islands',
    flag: '🇰🇾',
    code: 'KY',
  },
  {
    label: 'Central African Republic',
    flag: '🇨🇫',
    code: 'CF',
  },
  {
    label: 'Chad',
    flag: '🇹🇩',
    code: 'TD',
  },
  {
    label: 'Chile',
    flag: '🇨🇱',
    code: 'CL',
  },
  {
    label: 'China',
    flag: '🇨🇳',
    code: 'CN',
  },
  {
    label: 'Christmas Island',
    flag: '🇨🇽',
    code: 'CX',
  },
  {
    label: 'Cocos (Keeling) Islands',
    flag: '🇨🇨',
    code: 'CC',
  },
  {
    label: 'Colombia',
    flag: '🇨🇴',
    code: 'CO',
  },
  {
    label: 'Comoros',
    flag: '🇰🇲',
    code: 'KM',
  },
  {
    label: 'Congo',
    flag: '🇨🇬',
    code: 'CG',
  },
  {
    label: 'Congo, The Democratic Republic of the Congo',
    flag: '🇨🇩',
    code: 'CD',
  },
  {
    label: 'Cook Islands',
    flag: '🇨🇰',
    code: 'CK',
  },
  {
    label: 'Costa Rica',
    flag: '🇨🇷',
    code: 'CR',
  },
  {
    label: "Cote d'Ivoire",
    flag: '🇨🇮',
    code: 'CI',
  },
  {
    label: 'Croatia',
    flag: '🇭🇷',
    code: 'HR',
  },
  {
    label: 'Cuba',
    flag: '🇨🇺',
    code: 'CU',
  },
  {
    label: 'Cyprus',
    flag: '🇨🇾',
    code: 'CY',
  },
  {
    label: 'Czech Republic',
    flag: '🇨🇿',
    code: 'CZ',
  },
  {
    label: 'Denmark',
    flag: '🇩🇰',
    code: 'DK',
  },
  {
    label: 'Djibouti',
    flag: '🇩🇯',
    code: 'DJ',
  },
  {
    label: 'Dominica',
    flag: '🇩🇲',
    code: 'DM',
  },
  {
    label: 'Dominican Republic',
    flag: '🇩🇴',
    code: 'DO',
  },
  {
    label: 'Ecuador',
    flag: '🇪🇨',
    code: 'EC',
  },
  {
    label: 'Egypt',
    flag: '🇪🇬',
    code: 'EG',
  },
  {
    label: 'El Salvador',
    flag: '🇸🇻',
    code: 'SV',
  },
  {
    label: 'Equatorial Guinea',
    flag: '🇬🇶',
    code: 'GQ',
  },
  {
    label: 'Eritrea',
    flag: '🇪🇷',
    code: 'ER',
  },
  {
    label: 'Estonia',
    flag: '🇪🇪',
    code: 'EE',
  },
  {
    label: 'Ethiopia',
    flag: '🇪🇹',
    code: 'ET',
  },
  {
    label: 'Falkland Islands (Malvinas)',
    flag: '🇫🇰',
    code: 'FK',
  },
  {
    label: 'Faroe Islands',
    flag: '🇫🇴',
    code: 'FO',
  },
  {
    label: 'Fiji',
    flag: '🇫🇯',
    code: 'FJ',
  },
  {
    label: 'Finland',
    flag: '🇫🇮',
    code: 'FI',
  },
  {
    label: 'France',
    flag: '🇫🇷',
    code: 'FR',
  },
  {
    label: 'French Guiana',
    flag: '🇬🇫',
    code: 'GF',
  },
  {
    label: 'French Polynesia',
    flag: '🇵🇫',
    code: 'PF',
  },
  {
    label: 'French Southern Territories',
    flag: '🇹🇫',
    code: 'TF',
  },
  {
    label: 'Gabon',
    flag: '🇬🇦',
    code: 'GA',
  },
  {
    label: 'Gambia',
    flag: '🇬🇲',
    code: 'GM',
  },
  {
    label: 'Georgia',
    flag: '🇬🇪',
    code: 'GE',
  },
  {
    label: 'Germany',
    flag: '🇩🇪',
    code: 'DE',
  },
  {
    label: 'Ghana',
    flag: '🇬🇭',
    code: 'GH',
  },
  {
    label: 'Gibraltar',
    flag: '🇬🇮',
    code: 'GI',
  },
  {
    label: 'Greece',
    flag: '🇬🇷',
    code: 'GR',
  },
  {
    label: 'Greenland',
    flag: '🇬🇱',
    code: 'GL',
  },
  {
    label: 'Grenada',
    flag: '🇬🇩',
    code: 'GD',
  },
  {
    label: 'Guadeloupe',
    flag: '🇬🇵',
    code: 'GP',
  },
  {
    label: 'Guam',
    flag: '🇬🇺',
    code: 'GU',
  },
  {
    label: 'Guatemala',
    flag: '🇬🇹',
    code: 'GT',
  },
  {
    label: 'Guernsey',
    flag: '🇬🇬',
    code: 'GG',
  },
  {
    label: 'Guinea',
    flag: '🇬🇳',
    code: 'GN',
  },
  {
    label: 'Guinea-Bissau',
    flag: '🇬🇼',
    code: 'GW',
  },
  {
    label: 'Guyana',
    flag: '🇬🇾',
    code: 'GY',
  },
  {
    label: 'Haiti',
    flag: '🇭🇹',
    code: 'HT',
  },
  {
    label: 'Heard Island and Mcdonald Islands',
    flag: '🇭🇲',
    code: 'HM',
  },
  {
    label: 'Holy See (Vatican City State)',
    flag: '🇻🇦',
    code: 'VA',
  },
  {
    label: 'Honduras',
    flag: '🇭🇳',
    code: 'HN',
  },
  {
    label: 'Hong Kong',
    flag: '🇭🇰',
    code: 'HK',
  },
  {
    label: 'Hungary',
    flag: '🇭🇺',
    code: 'HU',
  },
  {
    label: 'Iceland',
    flag: '🇮🇸',
    code: 'IS',
  },
  {
    label: 'India',
    flag: '🇮🇳',
    code: 'IN',
  },
  {
    label: 'Indonesia',
    flag: '🇮🇩',
    code: 'ID',
  },
  {
    label: 'Iran, Islamic Republic of Persian Gulf',
    flag: '🇮🇷',
    code: 'IR',
  },
  {
    label: 'Iraq',
    flag: '🇮🇶',
    code: 'IQ',
  },
  {
    label: 'Ireland',
    flag: '🇮🇪',
    code: 'IE',
  },
  {
    label: 'Isle of Man',
    flag: '🇮🇲',
    code: 'IM',
  },
  {
    label: 'Israel',
    flag: '🇮🇱',
    code: 'IL',
  },
  {
    label: 'Italy',
    flag: '🇮🇹',
    code: 'IT',
  },
  {
    label: 'Jamaica',
    flag: '🇯🇲',
    code: 'JM',
  },
  {
    label: 'Japan',
    flag: '🇯🇵',
    code: 'JP',
  },
  {
    label: 'Jersey',
    flag: '🇯🇪',
    code: 'JE',
  },
  {
    label: 'Jordan',
    flag: '🇯🇴',
    code: 'JO',
  },
  {
    label: 'Kazakhstan',
    flag: '🇰🇿',
    code: 'KZ',
  },
  {
    label: 'Kenya',
    flag: '🇰🇪',
    code: 'KE',
  },
  {
    label: 'Kiribati',
    flag: '🇰🇮',
    code: 'KI',
  },
  {
    label: "Korea, Democratic People's Republic of Korea",
    flag: '🇰🇵',
    code: 'KP',
  },
  {
    label: 'Korea, Republic of South Korea',
    flag: '🇰🇷',
    code: 'KR',
  },
  {
    label: 'Kosovo',
    flag: '🇽🇰',
    code: 'XK',
  },
  {
    label: 'Kuwait',
    flag: '🇰🇼',
    code: 'KW',
  },
  {
    label: 'Kyrgyzstan',
    flag: '🇰🇬',
    code: 'KG',
  },
  {
    label: 'Laos',
    flag: '🇱🇦',
    code: 'LA',
  },
  {
    label: 'Latvia',
    flag: '🇱🇻',
    code: 'LV',
  },
  {
    label: 'Lebanon',
    flag: '🇱🇧',
    code: 'LB',
  },
  {
    label: 'Lesotho',
    flag: '🇱🇸',
    code: 'LS',
  },
  {
    label: 'Liberia',
    flag: '🇱🇷',
    code: 'LR',
  },
  {
    label: 'Libyan Arab Jamahiriya',
    flag: '🇱🇾',
    code: 'LY',
  },
  {
    label: 'Liechtenstein',
    flag: '🇱🇮',
    code: 'LI',
  },
  {
    label: 'Lithuania',
    flag: '🇱🇹',
    code: 'LT',
  },
  {
    label: 'Luxembourg',
    flag: '🇱🇺',
    code: 'LU',
  },
  {
    label: 'Macao',
    flag: '🇲🇴',
    code: 'MO',
  },
  {
    label: 'Macedonia',
    flag: '🇲🇰',
    code: 'MK',
  },
  {
    label: 'Madagascar',
    flag: '🇲🇬',
    code: 'MG',
  },
  {
    label: 'Malawi',
    flag: '🇲🇼',
    code: 'MW',
  },
  {
    label: 'Malaysia',
    flag: '🇲🇾',
    code: 'MY',
  },
  {
    label: 'Maldives',
    flag: '🇲🇻',
    code: 'MV',
  },
  {
    label: 'Mali',
    flag: '🇲🇱',
    code: 'ML',
  },
  {
    label: 'Malta',
    flag: '🇲🇹',
    code: 'MT',
  },
  {
    label: 'Marshall Islands',
    flag: '🇲🇭',
    code: 'MH',
  },
  {
    label: 'Martinique',
    flag: '🇲🇶',
    code: 'MQ',
  },
  {
    label: 'Mauritania',
    flag: '🇲🇷',
    code: 'MR',
  },
  {
    label: 'Mauritius',
    flag: '🇲🇺',
    code: 'MU',
  },
  {
    label: 'Mayotte',
    flag: '🇾🇹',
    code: 'YT',
  },
  {
    label: 'Mexico',
    flag: '🇲🇽',
    code: 'MX',
  },
  {
    label: 'Micronesia, Federated States of Micronesia',
    flag: '🇫🇲',
    code: 'FM',
  },
  {
    label: 'Moldova',
    flag: '🇲🇩',
    code: 'MD',
  },
  {
    label: 'Monaco',
    flag: '🇲🇨',
    code: 'MC',
  },
  {
    label: 'Mongolia',
    flag: '🇲🇳',
    code: 'MN',
  },
  {
    label: 'Montenegro',
    flag: '🇲🇪',
    code: 'ME',
  },
  {
    label: 'Montserrat',
    flag: '🇲🇸',
    code: 'MS',
  },
  {
    label: 'Morocco',
    flag: '🇲🇦',
    code: 'MA',
  },
  {
    label: 'Mozambique',
    flag: '🇲🇿',
    code: 'MZ',
  },
  {
    label: 'Myanmar',
    flag: '🇲🇲',
    code: 'MM',
  },
  {
    label: 'Namibia',
    flag: '🇳🇦',
    code: 'NA',
  },
  {
    label: 'Nauru',
    flag: '🇳🇷',
    code: 'NR',
  },
  {
    label: 'Nepal',
    flag: '🇳🇵',
    code: 'NP',
  },
  {
    label: 'Netherlands',
    flag: '🇳🇱',
    code: 'NL',
  },
  {
    label: 'Netherlands Antilles',
    flag: '',
    code: 'AN',
  },
  {
    label: 'New Caledonia',
    flag: '🇳🇨',
    code: 'NC',
  },
  {
    label: 'New Zealand',
    flag: '🇳🇿',
    code: 'NZ',
  },
  {
    label: 'Nicaragua',
    flag: '🇳🇮',
    code: 'NI',
  },
  {
    label: 'Niger',
    flag: '🇳🇪',
    code: 'NE',
  },
  {
    label: 'Nigeria',
    flag: '🇳🇬',
    code: 'NG',
  },
  {
    label: 'Niue',
    flag: '🇳🇺',
    code: 'NU',
  },
  {
    label: 'Norfolk Island',
    flag: '🇳🇫',
    code: 'NF',
  },
  {
    label: 'Northern Mariana Islands',
    flag: '🇲🇵',
    code: 'MP',
  },
  {
    label: 'Norway',
    flag: '🇳🇴',
    code: 'NO',
  },
  {
    label: 'Oman',
    flag: '🇴🇲',
    code: 'OM',
  },
  {
    label: 'Pakistan',
    flag: '🇵🇰',
    code: 'PK',
  },
  {
    label: 'Palau',
    flag: '🇵🇼',
    code: 'PW',
  },
  {
    label: 'Palestinian Territory, Occupied',
    flag: '🇵🇸',
    code: 'PS',
  },
  {
    label: 'Panama',
    flag: '🇵🇦',
    code: 'PA',
  },
  {
    label: 'Papua New Guinea',
    flag: '🇵🇬',
    code: 'PG',
  },
  {
    label: 'Paraguay',
    flag: '🇵🇾',
    code: 'PY',
  },
  {
    label: 'Peru',
    flag: '🇵🇪',
    code: 'PE',
  },
  {
    label: 'Philippines',
    flag: '🇵🇭',
    code: 'PH',
  },
  {
    label: 'Pitcairn',
    flag: '🇵🇳',
    code: 'PN',
  },
  {
    label: 'Poland',
    flag: '🇵🇱',
    code: 'PL',
  },
  {
    label: 'Portugal',
    flag: '🇵🇹',
    code: 'PT',
  },
  {
    label: 'Puerto Rico',
    flag: '🇵🇷',
    code: 'PR',
  },
  {
    label: 'Qatar',
    flag: '🇶🇦',
    code: 'QA',
  },
  {
    label: 'Romania',
    flag: '🇷🇴',
    code: 'RO',
  },
  {
    label: 'Russia',
    flag: '🇷🇺',
    code: 'RU',
  },
  {
    label: 'Rwanda',
    flag: '🇷🇼',
    code: 'RW',
  },
  {
    label: 'Reunion',
    flag: '🇷🇪',
    code: 'RE',
  },
  {
    label: 'Saint Barthelemy',
    flag: '🇧🇱',
    code: 'BL',
  },
  {
    label: 'Saint Helena, Ascension and Tristan Da Cunha',
    flag: '🇸🇭',
    code: 'SH',
  },
  {
    label: 'Saint Kitts and Nevis',
    flag: '🇰🇳',
    code: 'KN',
  },
  {
    label: 'Saint Lucia',
    flag: '🇱🇨',
    code: 'LC',
  },
  {
    label: 'Saint Martin',
    flag: '🇲🇫',
    code: 'MF',
  },
  {
    label: 'Saint Pierre and Miquelon',
    flag: '🇵🇲',
    code: 'PM',
  },
  {
    label: 'Saint Vincent and the Grenadines',
    flag: '🇻🇨',
    code: 'VC',
  },
  {
    label: 'Samoa',
    flag: '🇼🇸',
    code: 'WS',
  },
  {
    label: 'San Marino',
    flag: '🇸🇲',
    code: 'SM',
  },
  {
    label: 'Sao Tome and Principe',
    flag: '🇸🇹',
    code: 'ST',
  },
  {
    label: 'Saudi Arabia',
    flag: '🇸🇦',
    code: 'SA',
  },
  {
    label: 'Senegal',
    flag: '🇸🇳',
    code: 'SN',
  },
  {
    label: 'Serbia',
    flag: '🇷🇸',
    code: 'RS',
  },
  {
    label: 'Seychelles',
    flag: '🇸🇨',
    code: 'SC',
  },
  {
    label: 'Sierra Leone',
    flag: '🇸🇱',
    code: 'SL',
  },
  {
    label: 'Singapore',
    flag: '🇸🇬',
    code: 'SG',
  },
  {
    label: 'Slovakia',
    flag: '🇸🇰',
    code: 'SK',
  },
  {
    label: 'Slovenia',
    flag: '🇸🇮',
    code: 'SI',
  },
  {
    label: 'Solomon Islands',
    flag: '🇸🇧',
    code: 'SB',
  },
  {
    label: 'Somalia',
    flag: '🇸🇴',
    code: 'SO',
  },
  {
    label: 'South Africa',
    flag: '🇿🇦',
    code: 'ZA',
  },
  {
    label: 'South Sudan',
    flag: '🇸🇸',
    code: 'SS',
  },
  {
    label: 'South Georgia and the South Sandwich Islands',
    flag: '🇬🇸',
    code: 'GS',
  },
  {
    label: 'Spain',
    flag: '🇪🇸',
    code: 'ES',
  },
  {
    label: 'Sri Lanka',
    flag: '🇱🇰',
    code: 'LK',
  },
  {
    label: 'Sudan',
    flag: '🇸🇩',
    code: 'SD',
  },
  {
    label: 'Suriname',
    flag: '🇸🇷',
    code: 'SR',
  },
  {
    label: 'Svalbard and Jan Mayen',
    flag: '🇸🇯',
    code: 'SJ',
  },
  {
    label: 'Swaziland',
    flag: '🇸🇿',
    code: 'SZ',
  },
  {
    label: 'Sweden',
    flag: '🇸🇪',
    code: 'SE',
  },
  {
    label: 'Switzerland',
    flag: '🇨🇭',
    code: 'CH',
  },
  {
    label: 'Syrian Arab Republic',
    flag: '🇸🇾',
    code: 'SY',
  },
  {
    label: 'Taiwan',
    flag: '🇹🇼',
    code: 'TW',
  },
  {
    label: 'Tajikistan',
    flag: '🇹🇯',
    code: 'TJ',
  },
  {
    label: 'Tanzania, United Republic of Tanzania',
    flag: '🇹🇿',
    code: 'TZ',
  },
  {
    label: 'Thailand',
    flag: '🇹🇭',
    code: 'TH',
  },
  {
    label: 'Timor-Leste',
    flag: '🇹🇱',
    code: 'TL',
  },
  {
    label: 'Togo',
    flag: '🇹🇬',
    code: 'TG',
  },
  {
    label: 'Tokelau',
    flag: '🇹🇰',
    code: 'TK',
  },
  {
    label: 'Tonga',
    flag: '🇹🇴',
    code: 'TO',
  },
  {
    label: 'Trinidad and Tobago',
    flag: '🇹🇹',
    code: 'TT',
  },
  {
    label: 'Tunisia',
    flag: '🇹🇳',
    code: 'TN',
  },
  {
    label: 'Turkey',
    flag: '🇹🇷',
    code: 'TR',
  },
  {
    label: 'Turkmenistan',
    flag: '🇹🇲',
    code: 'TM',
  },
  {
    label: 'Turks and Caicos Islands',
    flag: '🇹🇨',
    code: 'TC',
  },
  {
    label: 'Tuvalu',
    flag: '🇹🇻',
    code: 'TV',
  },
  {
    label: 'Uganda',
    flag: '🇺🇬',
    code: 'UG',
  },
  {
    label: 'Ukraine',
    flag: '🇺🇦',
    code: 'UA',
  },
  {
    label: 'United Arab Emirates',
    flag: '🇦🇪',
    code: 'AE',
  },
  {
    label: 'United Kingdom',
    flag: '🇬🇧',
    code: 'GB',
  },
  {
    label: 'United States',
    flag: '🇺🇸',
    code: 'US',
  },
  {
    label: 'Uruguay',
    flag: '🇺🇾',
    code: 'UY',
  },
  {
    label: 'Uzbekistan',
    flag: '🇺🇿',
    code: 'UZ',
  },
  {
    label: 'Vanuatu',
    flag: '🇻🇺',
    code: 'VU',
  },
  {
    label: 'Venezuela, Bolivarian Republic of Venezuela',
    flag: '🇻🇪',
    code: 'VE',
  },
  {
    label: 'Vietnam',
    flag: '🇻🇳',
    code: 'VN',
  },
  {
    label: 'Virgin Islands, British',
    flag: '🇻🇬',
    code: 'VG',
  },
  {
    label: 'Virgin Islands, U.S.',
    flag: '🇻🇮',
    code: 'VI',
  },
  {
    label: 'Wallis and Futuna',
    flag: '🇼🇫',
    code: 'WF',
  },
  {
    label: 'Yemen',
    flag: '🇾🇪',
    code: 'YE',
  },
  {
    label: 'Zambia',
    flag: '🇿🇲',
    code: 'ZM',
  },
  {
    label: 'Zimbabwe',
    flag: '🇿🇼',
    code: 'ZW',
  },
];

const CountryFlagType = {
  IMAGE: 'IMAGE',
  EMOJI: 'EMOJI',
};

const getCountryFlag = (countryISO, type = CountryFlagType.IMAGE) => {
  switch (type) {
    case CountryFlagType.IMAGE:
      return countryImages[countryISO] || DefaultProfilePicture;
    case CountryFlagType.EMOJI:
      return countries.find((c) => c.code === countryISO)?.flag || '🚩';
    default:
      return null;
  }
};

const getCountryNameByCode = (countryISO) => countries.find((c) => c.code === countryISO)?.label || 'Unknown';

const getBadgeBuilderModelName = (countryISO) => {
  switch (countryISO) {
    case 'SG':
      return 'sg-guides-section';
    case 'PH':
      return 'ph-guides-section';
    case 'EE':
      return 'ee-guides-section';
    case 'LT':
      return 'lt-guides-section';
    case 'JP':
      return 'jp-guides-section';
    case 'US':
      return 'us-guides-section';
    case 'NZ':
      return 'nz-guides-section';
    default:
      return 'guides';
  }
};

const getEventsPageBuilderModelName = (countryISO) => {
  if (Config.Env !== EnvironmentEnum.Production) return 'whats-on';
  switch (countryISO) {
    case 'SG':
      return 'whatson'; // Singapore
    case 'PH':
      return 'ph-events-page'; // Philippines
    case 'EE':
      return 'ee-events-page'; // Estonia
    case 'LT':
      return 'lt-events-page'; // Lithuania
    case 'JP':
      return 'whatson'; // Japan (to be created)
    case 'US':
      return 'whatson'; // USA (to be created)
    case 'NZ':
      return 'nz-events-page'; // New Zealand
    default:
      return 'whatson'; // Singapore
  }
}; // for production

export {
  countries, CountryFlagType, getCountryFlag, getBadgeBuilderModelName, getEventsPageBuilderModelName, getCountryNameByCode,
};
