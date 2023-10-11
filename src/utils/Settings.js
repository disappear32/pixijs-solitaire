const settings = {
    suits: new Map([
        [0, { name: 'diamond', color: '0xFF0000' }],
        [1, { name: 'spade', color: '0x000000' }],
        [2, { name: 'heart', color: '0xFF0000' }],
        [3, { name: 'club', color: '0x000000' }]
    ]),
    values: new Map([
        [0, { name: '2', value: 2 }],
        [1, { name: '3', value: 3 }],
        [2, { name: '4', value: 4 }],
        [3, { name: '5', value: 5 }],
        [4, { name: '6', value: 6 }],
        [5, { name: '7', value: 7 }],
        [6, { name: '8', value: 8 }],
        [7, { name: '9', value: 9 }],
        [8, { name: '10', value: 10 }],
        [9, { name: 'J', value: 11 }],
        [10, { name: 'Q', value: 12 }],
        [11, { name: 'K', value: 13 }],
        [12, { name: 'A', value: 14 }]
    ]),
    cardSize: {
        width: 45,
        height: 70
    }
}


export default settings