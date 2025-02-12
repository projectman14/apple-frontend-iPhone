import { useEffect, useRef, useState } from 'react'
import { hightlightsSlides } from '../constants'
import gsap from 'gsap';
import { pauseImg, playImg, replayImg } from '../utils';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);


const VideoCarousal = () => {
    const videoRef = useRef([]);
    const videospanRef = useRef([]);
    const videodivRef = useRef([]);

    const [video, setVideo] = useState({
        isEnd: false,
        startPlay: false,
        videoId: 0,
        isLastVideo: false,
        isPlaying: false,
    })

    const [loadedData, setLoadedData] = useState([])

    const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

    useGSAP(() => {

        gsap.to('#slider' , {
            transform: `translateX(${-100 * videoId}%)`,
            duration : 2,
            ease: 'power2.inOut'
        })

        gsap.to('#video', {
            scrollTrigger: {
                trigger: '#video',
                toggleActions: 'restart none none none'
            },

            onComplete: () => {
                setVideo((pre) => ({ ...pre, startPlay: true, isPlaying: true }))
            }
        })
    }, [isEnd, videoId])

    useEffect(() => {
        if (loadedData.length > 3) {
            if (!isPlaying) {
                videoRef.current[videoId].pause();
            } else {
                startPlay && videoRef.current[videoId].play();
            }
        }
    }, [startPlay, videoId, loadedData, isPlaying])

    const handleLoadedMetaData = (i, e) => setLoadedData((pre) => [...pre, e])

    useEffect(() => {
        let currentProgress = 0;
        let span = videospanRef.current;

        if (span[videoId]) {
            let anim = gsap.to(span[videoId], {
                onUpdate: () => {
                    // get the progress of the video
                    const progress = Math.ceil(anim.progress() * 100);

                    if (progress != currentProgress) {
                        currentProgress = progress;

                        // set the width of the progress bar
                        gsap.to(videodivRef.current[videoId], {
                            width:window.innerWidth < 760
                                    ? "10vw" // mobile
                                    : window.innerWidth < 1200
                                        ? "10vw" // tablet
                                        : "4vw", // laptop
                        });

                        gsap.to(span[videoId], {
                            width: `${currentProgress}%`,
                            backgroundColor: "white",
                        });
                    }
                },

                onComplete: () => {
                    if(isPlaying){
                        gsap.to(videodivRef.current[videoId] , {
                            width: '12px'
                        })

                        gsap.to(span[videoId] , {
                            backgroundColor : '#afafaf'
                        }) 
                    }
                }
            })

            if(videoId === 0) {
                anim.restart();
            }

            const animUpdate = () => {
                anim.progress(videoRef.current[videoId].currentTime / hightlightsSlides[videoId].videoDuration);
            }

            if(isPlaying){
                gsap.ticker.add(animUpdate);
            }else {
                gsap.ticker.remove(animUpdate);
            }
        }

        
    }, [videoId, startPlay])

    const handleProcess = (type, i) => {
        switch (type) {
            case 'video-end':
                setVideo((prevVideo) => ({ ...prevVideo, isEnd: true, videoId: i + 1 }))
                break;

            case 'video-last':
                setVideo((pre) => ({ ...pre, isLastVideo: true }))
                break;

            case 'video-reset':
                setVideo((pre) => ({ ...pre, isLastVideo: false, videoId: 0 }))
                break;

            case 'play':
                setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }))
                break;

            case 'pause':
                setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }))
                break;

            default:
                return video;
        }
    }

    return (
        <>
            <div className='flex items-center'>
                {hightlightsSlides.map((list, i) => (
                    <div key={list.id} id='slider' className='sm:pr-20 pr-10'>
                        <div className='video-carousel_container'>
                            <div className='w-full h-full flex-center rounded-3xl overflow-hidden bg-black'>
                                <video id='video' playsInline={true} preload='auto' muted ref={(el) => (videoRef.current[i] = el)} onPlay={() => {
                                    setVideo((prevVideo) => ({
                                        ...prevVideo, isPlaying: true
                                    }))
                                }} onLoadedMetadata={(e) => handleLoadedMetaData(i, e)} onEnded={() => 
                                    i !== 3 ? handleProcess('video-end' , i) : handleProcess('video-last')
                                }>
                                    <source src={list.video} type='video/mp4' />
                                </video>
                            </div>
                            <div className='absolute top-12 left-[5%] z-10'>
                                {list.textLists.map((text) => (
                                    <p key={text} className='md:text-2xl text-xl font-medium'>{text}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className='relative flex-center mt-10'>
                <div className='flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full'>
                    {videoRef.current.map((_, i) => (
                        <span key={i} ref={(el) => (videodivRef.current[i] = el)} className='mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer'>
                            <span className='absolute h-full w-full rounded-full ' ref={(el) => (videospanRef.current[i] = el)} ></span>
                        </span>
                    ))}
                </div>
                <button className='control-btn'>
                    <img src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg} onClick={isLastVideo ? () => { handleProcess('video-reset') } : !isPlaying ? () => { handleProcess('play') } : () => { handleProcess('pause') }} />
                </button>
            </div>
        </>
    )
}

export default VideoCarousal