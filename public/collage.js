const numCovers = 4; //number of album covers shown in the collage
let frequencies, topFreqs;
let prevLow; //the previous low value

export const createCollage = tracks => {
    frequencies = new Map();
    topFreqs = [];
    prevLow = -1;
    for (let i = 0; i < numCovers; i++) {
        topFreqs[i] = {
            url: '',
            freq: 0
        };
    }

    for (let i = 0; i < tracks.length; i++) {
        const url = tracks[i].track.album.images[0].url;
        const freq = frequencies.has(url) ? frequencies.get(url) + 1 : 1;
        frequencies.set(url, freq);
    }

    for (const url of frequencies.keys()) {
        const freq = frequencies.get(url);
        addToTopFreqs(url, freq);
    }

    return topFreqs;
}

const addToTopFreqs = (url, freq) => {
    let lowFreq = Number.MAX_SAFE_INTEGER, lowIndex = -1;
    //if the freq. to be added is less than the previous smallest one, skip
    if (freq > prevLow) {
        for (let i = 0; i < numCovers; i++) {
            let curFreq = topFreqs[i].freq;
            if (curFreq < lowFreq) {
                lowIndex = i;
                lowFreq = curFreq;
            }
        }

        prevLow = lowFreq;
        if (topFreqs[lowIndex].freq < freq)
            topFreqs[lowIndex] = {url, freq};
    }
}