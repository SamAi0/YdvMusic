import React, { useState } from 'react';
import { BookOpen, ArrowLeft, PlayCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface KidsStoriesProps {
    setCurrentView: (view: string) => void;
}

const stories = [
    {
        id: 1,
        title: 'The Magical Forest',
        cover: 'https://images.pexels.com/photos/255377/pexels-photo-255377.jpeg?auto=compress&cs=tinysrgb&w=600',
        description: 'Help the little fox find the magic musical note!'
    },
    {
        id: 2,
        title: 'Journey to the Stars',
        cover: 'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=600',
        description: 'Fly through space and discover new sounds.'
    }
];

// Content for a simple interactive story
const storyContent = [
    {
        text: "Once upon a time, a little fox wanted to make a song but couldn't find the perfect beat. He walked into the Magical Forest.",
        image: 'https://images.pexels.com/photos/145939/pexels-photo-145939.jpeg?auto=compress&cs=tinysrgb&w=800',
        choices: [
            { text: "Listen to the birds", bgAudio: "birds" },
            { text: "Walk by the river", bgAudio: "river" }
        ]
    },
    {
        text: "The sound was nice, but the fox needed more. Suddenly, a wise owl appeared singing a beautiful melody.",
        image: 'https://images.pexels.com/photos/10312675/pexels-photo-10312675.jpeg?auto=compress&cs=tinysrgb&w=800',
        choices: [
            { text: "Sing along with the owl", bgAudio: "singing" },
            { text: "Look for another animal", bgAudio: "silence" }
        ]
    },
    {
        text: "With all the sounds coming together, the fox had made the most beautiful forest song ever! The End.",
        image: 'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=800',
        choices: []
    }
];

const KidsStories: React.FC<KidsStoriesProps> = ({ setCurrentView }) => {
    const [activeStory, setActiveStory] = useState<number | null>(null);
    const [pageIndex, setPageIndex] = useState(0);

    const startStory = (id: number) => {
        setActiveStory(id);
        setPageIndex(0);
    };

    const handleChoice = (bgAudio: string) => {
        // In a full app, this would trigger an audio context change
        toast.success(`Ambient sound changed to: ${bgAudio} 🎵`);

        // Move to next page
        if (pageIndex < storyContent.length - 1) {
            setPageIndex(pageIndex + 1);
        }
    };

    return (
        <div className="flex-1 bg-gradient-to-br from-purple-50 to-pink-50 p-6 md:p-8 overflow-y-auto w-full max-w-full">
            <div className="flex items-center space-x-4 mb-8">
                <button
                    onClick={() => activeStory ? setActiveStory(null) : setCurrentView('kids-home')}
                    className="bg-white text-gray-700 p-3 rounded-2xl shadow-md hover:bg-gray-50 transition-colors shrink-0"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 flex items-center gap-3">
                    <BookOpen className="w-10 h-10 text-purple-500 shrink-0" />
                    {activeStory ? storyContent[pageIndex].text.length > 30 ? 'Reading...' : 'Story' : 'Magic Stories'}
                </h1>
            </div>

            {!activeStory ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-8">
                    {stories.map(story => (
                        <div key={story.id} className="bg-white rounded-[2rem] p-6 shadow-xl border-4 border-white flex flex-col items-center text-center transition-transform hover:-translate-y-2 group">
                            <img src={story.cover} alt={story.title} className="w-full h-48 object-cover rounded-2xl mb-6 shadow-md" />
                            <h2 className="text-2xl font-black text-gray-800 mb-2">{story.title}</h2>
                            <p className="text-gray-500 font-semibold mb-6">{story.description}</p>
                            <button
                                onClick={() => startStory(story.id)}
                                className="bg-purple-500 text-white font-bold text-xl px-8 py-4 rounded-full shadow-[0_8px_0_rgb(147,51,234)] active:shadow-[0_0px_0_rgb(147,51,234)] active:translate-y-2 transition-all w-full flex items-center justify-center gap-2"
                            >
                                <PlayCircle className="w-6 h-6" /> Read Story
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border-8 border-purple-100 animate-fade-in-up flex flex-col items-center">
                    <img
                        src={storyContent[pageIndex].image}
                        alt="Story Illustration"
                        className="w-full h-64 md:h-96 object-cover rounded-[2rem] shadow-lg mb-8"
                    />
                    <p className="text-2xl md:text-3xl font-bold text-gray-800 text-center leading-relaxed mb-10">
                        {storyContent[pageIndex].text}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        {storyContent[pageIndex].choices.length > 0 ? (
                            storyContent[pageIndex].choices.map((choice, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleChoice(choice.bgAudio)}
                                    className="bg-gradient-to-r from-purple-400 to-pink-500 text-white font-bold text-xl px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-center flex-1"
                                >
                                    {choice.text}
                                </button>
                            ))
                        ) : (
                            <button
                                onClick={() => {
                                    setActiveStory(null);
                                    if (typeof (window as any).confetti === 'function') {
                                        (window as any).confetti({
                                            particleCount: 100,
                                            spread: 60,
                                            origin: { y: 0.6 }
                                        });
                                    }
                                }}
                                className="bg-green-500 text-white font-bold text-xl px-12 py-4 rounded-full shadow-[0_8px_0_rgb(34,197,94)] active:shadow-[0_0px_0_rgb(34,197,94)] active:translate-y-2 transition-all"
                            >
                                Finish Story 🌟
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default KidsStories;
