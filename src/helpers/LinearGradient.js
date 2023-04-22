import { StyleSheet, View } from 'react-native-web';
import LinearGradient from 'react-native-web-linear-gradient'

/**
 * color gradient
 */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    linearGradient: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: "50%",
        height: "100%",
        width: "100%"
    },
})

const modifyColors = (colorArray) => {
    let modifiedColors = [];
    let counter = 0;
    while (counter < colorArray.length) {
        modifiedColors.push(colorArray[counter]);
        modifiedColors.push(colorArray[counter]);
        counter += 1;
    }
    return modifiedColors;
}

const getLocations = (numColors) => {
    /**
     * the default locations look quite decent
     * but if we wanted to min-max the design,
     * we could right them ourselves
     */
    let locations;
    switch(numColors) {
        case 2:
            locations = [0, 1];
            break;
        case 4:
            locations = [0, 0.4, 0.6, 1];
            break;
        case 6:
            locations = [0, 0.25, 0.45, 0.55, 0.75, 1];
            break;
        case 8:
            locations = [0, 0.21, 0.31, 0.45, 0.55, 0.69, 0.79, 1];
            break;
        case 10:
            locations = [];
            break;
        case 12:
            locations = [];
            break;
        default:
            throw new Error(`"numColors" must be odd and in range [2, 12] but is: ${numColors}.`);
    }
    return locations;
}

const getStart = (placeOnBoard) => {
    switch(placeOnBoard) {
        case "left column":
            return {x: 0, y: 0.5}
        case "top row":
            return {x: 0.5, y: 0}
        case "right column":
            return {x: 1, y: 0.5}
        case "bottom row":
            return {x: 0.5, y: 1}
        default:
            return {x: 0, y: 0}
    }
}

const getEnd = (placeOnBoard) => {
    switch(placeOnBoard) {
        case "left column":
            return {x: 1, y: 0.5}
        case "top row":
            return {x: 0.5, y: 1}
        case "right column":
            return {x: 0, y: 0.5}
        case "bottom row":
            return {x: 0.5, y: 0.0}
        default:
            return {x: 1, y: 1}
    }
}

const mixColors = (colorArray, partOfBoard) => {
    // no need to do something fancy if there is just one color
    if (colorArray.length === 0) {
        return null;
    }
    // need to mix multiple colors
    else {
        const colorsToUse = modifyColors(colorArray);

        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={colorsToUse}
                    style={styles.linearGradient}
                    //locations={getLocations(colorsToUse.length)}
                    start={getStart(partOfBoard)}
                    end={getEnd(partOfBoard)}
                >
                </LinearGradient>
            </View>
        );
    }
}

export {mixColors};
