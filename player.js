// Data song
const songs = [
    {   
        id: 0,
        title: 'Flow',
        artist: 'Loksii',
        src: './songs/Flow_Loksii.mp3',
        img: './songs/Flow.webp'
    },
    {   
        id: 1,
        title: 'Amalgam',
        artist: 'Rockot',
        src: './songs/Amalgam_Rockot.mp3',
        img: './songs/Amalgam.webp'
    },
    {   
        id: 2,
        title: 'Night Detective',
        artist: 'Amaksi',
        src: './songs/NightDetective_Amaksi.mp3',
        img: './songs/NightDetective.webp'
    },
    {   
        id: 3,
        title: 'Nightfall',
        artist: 'SoulProMusic',
        src: './songs/Nightfall.mp3',
        img: './songs/Nightfall_SoulProMusic.jpg'
    },
    {   
        id: 4,
        title: 'Bounce On it',
        artist: 'AlexGrohl',
        src: './songs/BounceOnit_AlexGrohl.mp3',
        img: './songs/BounceOnit.webp'
    }

]
// Query Elements
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const player = $('.player')
const seedingBtn = $('#progress')
const playBtn = $('.btn-toggle-play')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const playlist = $('.playlist')
// Key localStorage
const KEY_SETTING = 'Player_settings'
// Main App
const App = {
    currentIndex: 0,
    isRandom: false,
    isRepeat: false,
    // Group Render
    renderPlaylist(){
        const playlist = $('.playlist')
        const innerHTML = songs.map(song => `
        <div class="song" id=${song.id}>
            <div class="thumb" style="background-image: url(${song.img})">
            </div>
            <div class="body">
              <h3 class="title">${song.title}</h3>
              <p class="author">${song.artist}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
            `)
        playlist.innerHTML = innerHTML.join('')        
        return true
    },
    loadSong(){
        const titleSongPlaying = $('header h1')
        const cd_thumb = $('.cd-thumb')
        const audio = $('#audio')
        // update currentSong       
        this.currentSong = songs[this.currentIndex]
        cd_thumb.style.backgroundImage = `url(${this.currentSong.img})`
        titleSongPlaying.innerHTML = this.currentSong.title
        audio.src = this.currentSong.src        
             
    },
    activeSongPlaylist(){
        const currentSongElement = document.getElementById(`${this.currentSong.id}`)
        const prevSongElement = $('.song.active')               
        prevSongElement && prevSongElement.classList.remove('active')        
        currentSongElement.classList.add('active')
        return currentSongElement
    },
    // Group button
    repeatBtn(){
        const repeatBtn = $('.btn-repeat')
        repeatBtn.classList.toggle('active', App.isRepeat) // Load settings
        repeatBtn.onclick = () => {
            App.isRepeat = !App.isRepeat            
            repeatBtn.classList.toggle('active')
            audio.loop = App.isRepeat
            App.saveSettings('isRepeat', App.isRepeat)
        }         
    },
    randomBtn(){
        const randomBtn = $('.btn-random')
        randomBtn.classList.toggle('active', App.isRandom) // Load settings
        randomBtn.onclick = () => {
            App.isRandom = !App.isRandom
            randomBtn.classList.toggle('active', App.isRandom)
            App.saveSettings('isRandom', App.isRandom)     
        }
    },
    playButton(){                      
        if(player.classList.contains('playing')) {
            this.handlePauseSong()          
        } else {
            this.handlePlaySong()
        }  
    },
    playNextSong(){
        nextBtn.style.color = 'red'
        if (this.isRandom) {
            this.setRandomIndex() 
        } else { 
            this.currentIndex = (this.currentIndex + 1 === songs.length) ? 0 : this.currentIndex + 1
        }               
        this.loadSong()
        this.handlePlaySong()
        setTimeout(() => {nextBtn.style.color = ''},200)        
    },
    playPrevSong(){
        prevBtn.style.color = 'red'
        if (this.isRandom) {
            this.setRandomIndex()
        } else { 
            this.currentIndex = (this.currentIndex - 1  < 0) ? songs.length - 1 : this.currentIndex - 1
        }   
        this.loadSong()
        this.handlePlaySong()
        setTimeout(() => {prevBtn.style.color = ''},200)        
    },
    songOption(indexTarget){console.log('Song Option feature for song: ', songs[indexTarget].title);
    },
    // Group helper function / Global event handlers  
    hanldeClickOnPlayList() {
        playlist.onclick = (e) => {
            const songElementTarget = e.target.closest('.song')
            const indexTarget = Number(songElementTarget.id)
            const optionElementTarget = e.target.closest('.option')
            if (optionElementTarget) {
                this.songOption(indexTarget)
            } else if (this.currentIndex !== indexTarget) {
                this.currentIndex = indexTarget
                this.loadSong()
                this.handlePlaySong()
            }
        }   
    },
    handleSrcoll(){
        const cdContainer = $('.cd')
        const cd_thumbWidth = cdContainer.offsetWidth
        window.addEventListener('scroll', () => {            
            const scrollY = window.scrollY
            let currentWidth = cd_thumbWidth - scrollY
            cdContainer.style.width =  currentWidth < 0 ? 0 : currentWidth + 'px'            
        }) 
    },
    handlePlaySong(){
        audio.play()
        // Update UI
        player.classList.add('playing')
        const currentSongElement = this.activeSongPlaylist()
        // Seeding progress
        audio.ontimeupdate = () =>  {
            let percentProgress = audio.currentTime / audio.duration *100
            seedingBtn.value = percentProgress
        }
        this.animateObject.play()
        currentSongElement.scrollIntoView(
            { 
            behavior: "smooth",
            block: "end" }
        )      
       this.saveSettings()
    },
    handlePauseSong(){
        audio.pause()
        player.classList.remove('playing')
        this.animateObject.pause()
    },   
    creatAnimateObjectCD(){
        const CDthumbnail = $('.cd-thumb')
        const animateObject = CDthumbnail.animate([
            { transform: 'rotate(360deg)'}
        ],{
            duration: 10000,
            iterations: Infinity, 
        })
        animateObject.pause()
        // add new property: animateObject to App object
        this.animateObject = animateObject       
    }, 
    setRandomIndex(){
        let randomIndex
        do {
            randomIndex = Math.floor(Math.random() * (songs.length))
        } 
        while (App.currentIndex === randomIndex)
        App.currentIndex = randomIndex            
    },
    // Group save and load settings
    saveSettings(key= null, value = null) {
        (key !== null) && (this.settings[key] = value)
        this.settings.currentIndex = this.currentIndex
        localStorage.setItem(KEY_SETTING, JSON.stringify(this.settings))
    },
    loadSettings() {
        this.settings = JSON.parse(localStorage.getItem(KEY_SETTING)) || {}
        for (let key in this.settings) {
            this[key] = this.settings[key]
        }       
        },
    main() {
        // Get settings from localStorage
        this.loadSettings()
        // Setup Event first loading        
        this.renderPlaylist()
        this.loadSong()
        this.handleSrcoll()                
        playBtn.onclick = () => this.playButton()        
        seedingBtn.onchange = () => {       
            audio.currentTime =  seedingBtn.value * audio.duration / 100
        }        
        this.creatAnimateObjectCD()        
        nextBtn.onclick = () => this.playNextSong()
        prevBtn.onclick = () => this.playPrevSong()        
        this.randomBtn()
        this.repeatBtn()
        // End song event
        audio.onended = () => this.playNextSong()       
        this.hanldeClickOnPlayList()
        
    },
    
}
App.main()
