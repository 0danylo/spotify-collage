export const numCovers = 9;
let frequencies, lengths, topCovers;
let prevLowFreq, prevLowLen; //the previous low value; only increases as topFreqs is made

export const createCollage = tracks => {
    frequencies = new Map();
    lengths = new Map();
    topCovers = [];
    prevLowFreq = -1;
    for (let i = 0; i < numCovers; i++) {
        topCovers[i] = {
            url: '',
            freq: 0
        };
    }

    for (let i = 0; i < tracks.length; i++) {
        const url = tracks[i].track.album.images[1].url; //0: 640px, 1: 300px, 2: 64px
        const freq = frequencies.has(url) ? frequencies.get(url) + 1 : 1;
        const length = lengths.has(url) ? lengths.get(url) +
            tracks[i].track.duration_ms : tracks[i].track.duration_ms; //??

        frequencies.set(url, freq);
        lengths.set(url, length);
    }

    for (const url of frequencies.keys()) {
        const freq = frequencies.get(url);
        const length = lengths.get(url);
        addToTopCovers(url, freq, length);
    }

    console.log(topCovers);
    return topCovers;
}

const addToTopCovers = (url, freq, length) => {
    let lowFreq = Number.MAX_SAFE_INTEGER, lowIndex = -1;
    //if the freq to be added is less than the previous smallest one, skip
    if (freq > prevLowFreq) {
        for (let i = 0; i < numCovers; i++) {
            const curFreq = topCovers[i].freq;
            if (curFreq < lowFreq) {
                lowIndex = i;
                lowFreq = curFreq;
            } else if (curFreq == lowFreq) {
                //if the frequency is the same, compare the total lengths
                if (length > lengths.get(topCovers[i].url)) {
                    lowIndex = i;
                    lowFreq = curFreq;
                }
            }
        }

        prevLowFreq = lowFreq;
        if (topCovers[lowIndex].freq < freq)
            topCovers[lowIndex] = { url, freq };
    }
}

const addToTopCoversByLength = (url, freq, length) => {
    let lowLen = Number.MAX_SAFE_INTEGER, lowIndex = -1;
    //if the length to be added is less than the previous smallest one, skip
    if (length > prevLowLen) {
        for (let i = 0; i < numCovers; i++) {
            const curLen = lengths.get(topCovers[i].url);
            if (curLen < lowLen) {
                lowIndex = i;
                lowLen = curLen;
            } else if (curLen == lowLen) {
                //if the length is the same, compare the frequencies
                if (freq > topCovers[i].freq) {
                    lowIndex = i;
                    lowLen = curLen;
                }
            }
        }

        prevLowLen = lowLen;
        if (topCovers[lowIndex].freq < freq)
            topCovers[lowIndex] = { url, freq };
    }
}
