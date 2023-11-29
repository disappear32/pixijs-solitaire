const settings = {
    suits: new Map([
        [0, { name: 'diamond', color: '0xFF0000' }],
        [1, { name: 'spade', color: '0x000000' }],
        [2, { name: 'heart', color: '0xFF0000' }],
        [3, { name: 'club', color: '0x000000' }]
    ]),
    values: new Map([
        [0, { name: 'A', value: 1 }],
        [1, { name: '2', value: 2 }],
        [2, { name: '3', value: 3 }],
        [3, { name: '4', value: 4 }],
        [4, { name: '5', value: 5 }],
        [5, { name: '6', value: 6 }],
        [6, { name: '7', value: 7 }],
        [7, { name: '8', value: 8 }],
        [8, { name: '9', value: 9 }],
        [9, { name: '10', value: 10 }],
        [10, { name: 'J', value: 11 }],
        [11, { name: 'Q', value: 12 }],
        [12, { name: 'K', value: 13 }]
    ]),
    cardSize: {
        width: 48,
        height: 70
    },
}


export default settings