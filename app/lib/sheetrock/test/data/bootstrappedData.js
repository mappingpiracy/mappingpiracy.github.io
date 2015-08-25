/*global define */

(function (root, name, data) {

  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(name, data);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = data;
  } else {
    root[name] = data;
  }

}(this, 'bootstrappedData', {
  version: '0.6',
  status: 'ok',
  sig: '__sig__',
  table: {
    cols: [
      {
        id: 'A',
        label: 'Team',
        type: 'string',
        pattern: ''
      },
      {
        id: 'B', label: 'Pos',
        type: 'string',
        pattern: ''
      },
      {
        id: 'C',
        label: 'First',
        type: 'string',
        pattern: ''
      },
      {
        id: 'D',
        label: 'Last',
        type: 'string',
        pattern: ''
      },
      {
        id: 'E',
        label: 'Bats',
        type: 'string',
        pattern: ''
      },
      {
        id: 'L',
        label: 'BA',
        type: 'number',
        pattern: 'General'
      }
    ],
    'rows': [
      {
        c: [
          {
            v: 'MON'
          },
          {
            v: 'LF'
          },
          {
            v: 'Tim'
          },
          {
            v: 'Raines'
          },
          {
            v: 'Both'
          },
          {
            v: 0.334,
            f: '0.334'
          }
        ]
      },
      {
        c: [
          {
            v: 'NYM'
          },
          {
            v: '2B'
          },
          {
            v: 'Wally'
          },
          {
            v: 'Backman'
          },
          {
            v: 'Both'
          },
          {
            v: 0.32,
            f: '0.32'
          }
        ]
      },
      {
        c: [
          {
            v: 'HOU'
          },
          {
            v: 'RF'
          },
          {
            v: 'Kevin'
          },
          {
            v: 'Bass'
          },
          {
            v: 'Both'
          },
          {
            v: 0.311,
            f: '0.311'
          }
        ]
      },
      {
        c: [
          {
            v: 'CHC'
          },
          {
            v: 'OF'
          },
          {
            v: 'Jerry'
          },
          {
            v: 'Mumphrey'
          },
          {
            v: 'Both'
          },
          {
            v: 0.304,
            f: '0.304'
          }
        ]
      },
      {
        c: [
          {
            v: 'PIT'
          },
          {
            v: '2B'
          },
          {
            v: 'Johnny'
          },
          {
            v: 'Ray'
          },
          {
            v: 'Both'
          },
          {
            v: 0.301,
            f: '0.301'
          }
        ]
      },
      {
        c: [
          {
            v: 'STL'
          },
          {
            v: 'MI'
          },
          {
            v: 'Jose'
          },
          {
            v: 'Oquendo'
          },
          {
            v: 'Both'
          },
          {
            v: 0.297,
            f: '0.297'
          }
        ]
      },
      {
        c: [
          {
            v: 'MON'
          },
          {
            v: 'CF'
          },
          {
            v: 'Mitch'
          },
          {
            v: 'Webster'
          },
          {
            v: 'Both'
          },
          {
            v: 0.29,
            f: '0.29'
          }
        ]
      },
      {
        c: [
          {
            v: 'NYM'
          },
          {
            v: 'OF'
          },
          {
            v: 'Mookie'
          },
          {
            v: 'Wilson'
          },
          {
            v: 'Both'
          },
          {
            v: 0.289,
            f: '0.289'
          }
        ]
      },
      {
        c: [
          {
            v: 'MON'
          },
          {
            v: '1B'
          },
          {
            v: 'Wallace'
          },
          {
            v: 'Johnson'
          },
          {
            v: 'Both'
          },
          {
            v: 0.283,
            f: '0.283'
          }
        ]
      },
      {
        c: [
          {
            v: 'STL'
          },
          {
            v: 'SS'
          },
          {
            v: 'Ozzie'
          },
          {
            v: 'Smith'
          },
          {
            v: 'Both'
          },
          {
            v: 0.28,
            f: '0.28'
          }
        ]
      },
      {
        c: [
          {
            v: 'SFG'
          },
          {
            v: 'RF'
          },
          {
            v: 'Chili'
          },
          {
            v: 'Davis'
          },
          {
            v: 'Both'
          },
          {
            v: 0.278,
            f: '0.278'
          }
        ]
      }
    ]
  }
}));
