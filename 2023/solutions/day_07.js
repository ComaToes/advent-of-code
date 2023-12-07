export function part1(data) {

    const map = {
        "A": 14,
        "K": 13,
        "Q": 12,
        "J": 11,
        "T": 10
    }

    const comparator = (a,b) => a < b ? -1 : 1

    const hands = data.split(/\r?\n/).map( line => {
        const [cardsStr,bidStr] = line.split(/\s/)
        const cards = cardsStr.split("").map( ch => map[ch] || +ch )
        const bid = Number(bidStr)
        return {cards,bid}
    })

    const handTypes = {
        "5OK": 6,
        "4OK": 5,
        "FH": 4,
        "3OK": 3,
        "2P": 2,
        "1P": 1,
        "HC": 0,
    }

    const scoredHands = hands.map( hand => {

        let handType = handTypes["HC"]
        let last = 0
        let count = 0
        Array.from(hand.cards).sort(comparator).concat([0]).forEach( card => {
            if( !last ) {
                last = card
                count = 1
                return
            }
            if( card == last ) {
                count++
                return
            }
            if( count == 5 ) {
                handType = handTypes["5OK"]
            } else if( count == 4 ) {
                handType = handTypes["4OK"]
            } else if( count == 3 ) {
                if( handType == handTypes["1P"] || handType == handTypes["2P"] )
                    handType = handTypes["FH"]
                else
                    handType = handTypes["3OK"]
            } else if( count == 2 ) {
                if( handType == handTypes["3OK"] )
                    handType = handTypes["FH"]
                else if( handType == handTypes["1P"] )
                    handType = handTypes["2P"]
                else
                    handType = handTypes["1P"]
            }
            count = 1
            last = card
        })

        return {
            type: handType,
            ...hand
        }

    } )

    const arrayComparator = (a,b) => {
        for(let i = 0; i < a.length; i++) {
            if( a[i] < b[i] )
                return -1
            if( a[i] > b[i] )
                return 1
        }
        return 0
    }
    const scoreComparator = (a,b) => a.type < b.type ? -1 : a.type > b.type ? 1 : arrayComparator(a.cards, b.cards)

    return scoredHands.sort( scoreComparator ).reduce( (total, hand, rank) => total + (rank+1) * hand.bid, 0 )

}

export function part2(data) {
    
    const map = {
        "A": 14,
        "K": 13,
        "Q": 12,
        "J": 1,
        "T": 10
    }

    const comparator = (a,b) => a < b ? -1 : 1

    const hands = data.split(/\r?\n/).map( line => {
        const [cardsStr,bidStr] = line.split(/\s/)
        const cards = cardsStr.split("").map( ch => map[ch] || +ch )
        const bid = Number(bidStr)
        return {cards,bid}
    })

    const handTypes = {
        "5OK": 6,
        "4OK": 5,
        "FH": 4,
        "3OK": 3,
        "2P": 2,
        "1P": 1,
        "HC": 0,
    }

    const jokerMap = {
        6: "5OK",
        5: "5OK",
        4: "4OK",
        3: "4OK",
        2: "FH",
        1: "3OK",
        0: "1P"
    }

    const scoredHands = hands.map( hand => {

        let handType = handTypes["HC"]
        let last = 0
        let count = 0
        let jokerCount = 0
        Array.from(hand.cards).sort(comparator).concat([0]).forEach( card => {
            if( card == 1 ) {
                jokerCount++
                return
            }
            if( !last ) {
                last = card
                count = 1
                return
            }
            if( card == last ) {
                count++
                return
            }
            if( count == 5 ) {
                handType = handTypes["5OK"]
            } else if( count == 4 ) {
                handType = handTypes["4OK"]
            } else if( count == 3 ) {
                if( handType == handTypes["1P"] || handType == handTypes["2P"] )
                    handType = handTypes["FH"]
                else
                    handType = handTypes["3OK"]
            } else if( count == 2 ) {
                if( handType == handTypes["3OK"] )
                    handType = handTypes["FH"]
                else if( handType == handTypes["1P"] )
                    handType = handTypes["2P"]
                else
                    handType = handTypes["1P"]
            }
            count = 1
            last = card
        })

        while( jokerCount-- > 0 )
            handType = handTypes[ jokerMap[handType] ]

        return {
            type: handType,
            ...hand
        }

    } )

    const arrayComparator = (a,b) => {
        for(let i = 0; i < a.length; i++) {
            if( a[i] < b[i] )
                return -1
            if( a[i] > b[i] )
                return 1
        }
        return 0
    }
    const scoreComparator = (a,b) => a.type < b.type ? -1 : a.type > b.type ? 1 : arrayComparator(a.cards, b.cards)

    return scoredHands.sort( scoreComparator ).reduce( (total, hand, rank) => total + (rank+1) * hand.bid, 0 )

}
