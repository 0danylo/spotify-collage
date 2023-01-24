let frequencies = new Map();
let topFreq = [];
let numCovers = 4; //number of album covers shown in the collage

export const createCollage = tracks => {
    for (let i = 0; i < numCovers; i++) {
        topFreq.push({
            url: '',
            freq: 0
        });
    }

    for (const key in tracks) {
        const url = key.track.album.images[0].url;
        const freq = frequencies.has(url) ? frequencies.get(url) + 1 : 1;

        frequencies.set(url, freq);
    }

    for (const freq in frequencies) {
        if (frequencies.get(url) > topFreq[numCovers - 1].freq) {
            addToTopFreq({url, freq});
        }
    }
    console.log(topFreq);
}

/*
    does not work because the newly added object has a frequency 1 higher than one
    already in the array with the same url.

    need to only examine the url and replace
*/
const addToTopFreq = ({url, freq}) => {
    let newFreq = {
        url: url,
        freq: freq
    }
    console.log(newFreq)
    let newPushed = false

    if (!topFreq.some(c => c.url === url)) {
        //if it's not already in the array, add the cover to the end
        topFreq.push(newFreq)
        newPushed = true
    }

    let i = topFreq.findIndex(c => c.url === url)
    if (!newPushed)
        topFreq[i - 1].freq += 1
    for (i; i > 0; i--) {
        if (topFreq[i].freq > topFreq[i - 1].freq) {
            let temp = topFreq[i]
            topFreq[i] = topFreq[i - 1]
            topFreq[i - 1] = temp
        } else break;
    }

    if (newPushed)
        //remove the now least frequent (last) cover from the array
        topFreq = topFreq.slice(0, numCovers)
}