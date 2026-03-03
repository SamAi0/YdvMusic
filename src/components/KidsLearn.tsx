import React from 'react';
import { ArrowLeft, PlayCircle, Star, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface KidsLearnProps {
    setCurrentView: (view: string) => void;
}

const lessons = [
    {
        id: 1,
        title: 'The ABC Song',
        type: 'Alphabet',
        color: 'bg-yellow-400',
        icon: <Star className="w-8 h-8 text-yellow-100" />
    },
    {
        id: 2,
        title: 'Counting 1-10',
        type: 'Numbers',
        color: 'bg-blue-400',
        icon: <Sparkles className="w-8 h-8 text-blue-100" />
    },
    {
        id: 3,
        title: 'Animal Sounds',
        type: 'Nature',
        color: 'bg-green-400',
        icon: <Star className="w-8 h-8 text-green-100" />
    }
];

const KidsLearn: React.FC<KidsLearnProps> = ({ setCurrentView }) => {
    const handleLessonPlay = (title: string) => {
        toast.success(`Starting lesson: ${title} 📚🎵`);
    };

    return (
        <div className="flex-1 bg-gradient-to-br from-yellow-50 to-orange-50 p-6 md:p-8 overflow-y-auto w-full max-w-full">
            <div className="flex items-center space-x-4 mb-8">
                <button
                    onClick={() => setCurrentView('kids-home')}
                    className="bg-white text-gray-700 p-3 rounded-2xl shadow-md hover:bg-gray-50 transition-colors shrink-0"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
                    Learn & Grow
                </h1>
            </div>

            <div className="max-w-4xl mx-auto mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {lessons.map((lesson) => (
                        <button
                            key={lesson.id}
                            onClick={() => handleLessonPlay(lesson.title)}
                            className={`${lesson.color} rounded-3xl p-6 text-left text-white shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all border-4 border-white group relative overflow-hidden`}
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:scale-125 transition-transform duration-500">
                                {lesson.icon}
                            </div>
                            <div className="relative z-10">
                                <div className="bg-white/30 text-white font-bold px-3 py-1 rounded-full w-max text-sm mb-4">
                                    {lesson.type}
                                </div>
                                <h2 className="text-3xl font-black mb-6">{lesson.title}</h2>
                                <div className="flex items-center gap-2 font-bold text-lg bg-black/10 w-max px-4 py-2 rounded-full backdrop-blur-sm group-hover:bg-black/20 transition-colors">
                                    <PlayCircle className="w-6 h-6" /> Play Lesson
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="mt-12 bg-white rounded-[3rem] p-8 shadow-xl border-8 border-orange-100 text-center relative overflow-hidden">
                    <img
                        src="https://images.pexels.com/photos/8613071/pexels-photo-8613071.jpeg?auto=compress&cs=tinysrgb&w=800"
                        alt="Kids Learning"
                        className="w-full h-64 object-cover rounded-[2rem] shadow-lg mb-8"
                    />
                    <h2 className="text-3xl font-black text-gray-800 mb-4">Daily Quiz!</h2>
                    <p className="text-xl font-bold text-gray-500 mb-8">What instrument has black and white keys?</p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
                        <button onClick={() => toast.error('Oops, try again! 🎸')} className="bg-blue-100 text-blue-600 font-bold text-xl px-8 py-4 rounded-2xl border-4 border-blue-200 hover:bg-blue-200 hover:scale-105 transition-all text-center flex-1">
                            Guitar
                        </button>
                        <button onClick={() => { toast.success('Correct!! 🎉🎊'); (window as any).confetti?.() }} className="bg-green-100 text-green-600 font-bold text-xl px-8 py-4 rounded-2xl border-4 border-green-200 hover:bg-green-200 hover:scale-105 transition-all text-center flex-1">
                            Piano
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KidsLearn;
