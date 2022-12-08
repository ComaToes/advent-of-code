function getVisibilityAlong(arr) {
    let max = -1
    return arr.map( height => {
        if( height > max ) {
            max = height
            return true
        }
        return false
    })
}

function part1(data) {

    const gridRows = data.split(/\r?\n/).map( row => row.split('').map(Number) )
    const width = gridRows[0].length
    const height = gridRows.length

    const gridCols = Array(width).fill().map( () => Array(height).fill() )
                     .map( (col, i) => col.map( (x,j) => gridRows[j][i] ) )

    const horizontalVisibility = gridRows.map( row => {

        const visibleFromRight = getVisibilityAlong(row)
        const visibleFromLeft = getVisibilityAlong(row.reverse()).reverse()
        return visibleFromRight.map( (visible,i) => visible || visibleFromLeft[i] )

    })

    const verticalVisiblity = gridCols.map( col => {

        const visibleFromTop = getVisibilityAlong(col)
        const visibileFromBottom = getVisibilityAlong(col.reverse()).reverse()
        return visibleFromTop.map( (visible,i) => visible || visibileFromBottom[i] )

    })

    const combinedVisibility = horizontalVisibility.map( (row,i) => 
        row.map( (value,j) => value || verticalVisiblity[j][i] ) 
    )

    return combinedVisibility.flat().filter( value => value ).length

}

function getViewsAlong(arr) {
    return arr.map( (height, i) => {
        let score = 0
        for( let j = i+1; j < arr.length; j++ ) {
            score++
            if( arr[j] >= height )
                break
        }
        return score
    })
}

function part2(data) {

    const gridRows = data.split(/\r?\n/).map( row => row.split('').map(Number) )
    const width = gridRows[0].length
    const height = gridRows.length

    const gridCols = Array(width).fill().map( () => Array(height).fill() )
                     .map( (col, i) => col.map( (x,j) => gridRows[j][i] ) )

    const horizontalViews = gridRows.map( row => {

        const viewsToRight = getViewsAlong(row)
        const viewsToLeft = getViewsAlong(row.reverse()).reverse()
        return viewsToRight.map( (score,i) => score * viewsToLeft[i] )

    })

    const verticalViews = gridCols.map( col => {

        const viewsDown = getViewsAlong(col)
        const viewsUp = getViewsAlong(col.reverse()).reverse()
        return viewsDown.map( (score,i) => score * viewsUp[i] )

    })

    const combinedViews = horizontalViews.map( (row,i) => 
        row.map( (value,j) => value * verticalViews[j][i] ) 
    )

    return combinedViews.flat().reduce( (max,v) => max > v ? max : v, 0 )

}

module.exports = { part1, part2 }