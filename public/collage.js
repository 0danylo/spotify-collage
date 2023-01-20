export const createCollage = tracks => {
    let freq = new Map()
    for (let i = 0; i < tracks.length; i++) {
        freq.set(tracks[i].track.album.images[2].url, freq.get(tracks[i].track.album.images[2].url) + 1 || 1)
    }
    console.log(freq)
}
