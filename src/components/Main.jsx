import React, { useState } from 'react';
import { 
    FaPlus, 
    FaTrashAlt, 
    FaDice, 
    FaExclamationTriangle, 
    FaSpinner, 
    FaMagic,
    FaTimes,
    FaPencilAlt,
    FaCheck
} from 'react-icons/fa';
import { 
    MdRestaurantMenu, 
    MdOutlineRestaurant, 
    MdCelebration, 
    MdFormatListBulleted 
} from 'react-icons/md';

const Main = () => {
    const [inputValue, setInputValue] = useState('');
    const [foodList, setFoodList] = useState([]);

    const [editingIndex, setEditingIndex] = useState(null); 
    const [editingValue, setEditingValue] = useState(''); 

    const [showAlertPopup, setShowAlertPopup] = useState(false);
    const [alertMessage, setAlertMessage] = useState(''); 
    const [showClearConfirmPopup, setShowClearConfirmPopup] = useState(false);
    
    const [isRandomizing, setIsRandomizing] = useState(false);
    const [showResultPopup, setShowResultPopup] = useState(false);
    const [shufflingFood, setShufflingFood] = useState(''); 
    const [selectedFood, setSelectedFood] = useState(''); 

    const handleAddFood = (e) => {
        e.preventDefault(); 
        
        if (inputValue.trim() !== '') {
            const newItems = inputValue
                .split(/[\s,]+/)
                .filter(item => item.trim() !== '');
            
            const duplicatesWithExisting = newItems.filter(item => foodList.includes(item));
            const uniqueNewItems = Array.from(new Set(newItems));
            
            if (duplicatesWithExisting.length > 0 || newItems.length !== uniqueNewItems.length) {
                setAlertMessage('คุณได้กรอกเมนูที่มีอยู่แล้ว ระบบจะดึงเฉพาะเมนูใหม่เพิ่มให้เท่านั้น');
                setShowAlertPopup(true);
            }
            
            const itemsToAdd = uniqueNewItems.filter(item => !foodList.includes(item));
            
            if (itemsToAdd.length > 0) {
                setFoodList([...foodList, ...itemsToAdd]);
            }
            
            setInputValue('');
        }
    };

    const handleClearAllClick = (e) => {
        e.preventDefault();
        if (foodList.length > 0) {
            setShowClearConfirmPopup(true);
        }
    };

    const confirmClearAll = () => {
        setFoodList([]);
        setShowClearConfirmPopup(false);
    };

    const handleRemoveItem = (indexToRemove) => {
        setFoodList(foodList.filter((_, index) => index !== indexToRemove));
        if (editingIndex === indexToRemove) {
            setEditingIndex(null);
        }
    };

    const startEditing = (index, currentFood) => {
        setEditingIndex(index);
        setEditingValue(currentFood);
    };

    const saveEdit = (e, index) => {
        e.preventDefault();
        const trimmedValue = editingValue.trim();

        if (trimmedValue === '') {
            setEditingIndex(null);
            return;
        }

        const isDuplicate = foodList.some((item, i) => i !== index && item === trimmedValue);
        
        if (isDuplicate) {
            setAlertMessage('ชื่อเมนูนี้มีอยู่ในรายการแล้ว โปรดใช้ชื่ออื่น');
            setShowAlertPopup(true);
            return; 
        }

        const newList = [...foodList];
        newList[index] = trimmedValue;
        setFoodList(newList);
        setEditingIndex(null);
    };

    const handleRandomClick = () => {
        if (foodList.length === 0) return;

        setIsRandomizing(true);
        setShowResultPopup(true);
        
        let count = 0;
        const maxShuffles = 20; 
        const intervalTime = 100; 

        const shuffleInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * foodList.length);
            setShufflingFood(foodList[randomIndex]);
            count++;

            if (count >= maxShuffles) {
                clearInterval(shuffleInterval); 
                
                const finalIndex = Math.floor(Math.random() * foodList.length);
                setSelectedFood(foodList[finalIndex]);
                
                setIsRandomizing(false); 
            }
        }, intervalTime);
    };

    return (
        <div className='bg-[#F0EEE9] shadow-2xl rounded-2xl w-full max-w-[500px] p-5 sm:p-8 border border-white font-sans relative mx-auto'>
            
            <header className='text-center uppercase font-extrabold mb-5 sm:mb-6'>
                <div className="text-2xl sm:text-3xl text-[#393027] flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                    {/* ไอคอนช้อนส้อม เปลี่ยนเป็นสีชมพู */}
                    <MdRestaurantMenu className="text-[#c89cab]" /> 
                    <span>Random Food</span>
                    <FaDice className="text-[#c89cab]" /> 
                </div>
                <p className='text-[#393027]/60 text-xs sm:text-sm mt-1 normal-case'>สุ่มเมนูอาหารมื้อนี้กินอะไรดี?</p>
            </header>

            <main>
                <div className="w-full">
                    <form className='flex flex-col' onSubmit={handleAddFood}>
                        <label className='mb-2'>
                            <p className='mb-2 text-[#393027] font-medium text-sm sm:text-base'>กรุณากรอกชื่อเมนูที่ต้องการให้สุ่ม :</p>
                            <input 
                                // ช่อง Input ลดสีให้จางลงเป็นโปร่งแสง 20%
                                className='bg-[#c89cab]/20 text-[#393027] px-4 py-2 rounded-lg w-full h-[48px] focus:outline-none focus:ring-4 focus:ring-[#c89cab]/40 transition-all text-sm sm:text-base placeholder:text-[#393027]/50 shadow-inner' 
                                type="text" 
                                placeholder='เช่น ข้าวกะเพรา บะหมี่หมูกรอบ, สุกี้' 
                                value={inputValue} 
                                onChange={(e) => setInputValue(e.target.value)} 
                            />
                        </label>
                        
                        <div className="flex flex-col gap-3 mt-2">
                            <button 
                                type="submit" 
                                className='bg-[#9BAD50] text-[#393027] font-semibold rounded-lg w-full h-[48px] shadow-sm hover:opacity-90 hover:shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 text-sm sm:text-base'
                            >
                                <FaPlus /> เพิ่มเมนูอาหาร
                            </button>
                            
                            {/* ปุ่มล้างรายการทั้งหมด เปลี่ยนเป็นสีน้ำตาล */}
                            <a 
                                className={`text-xs sm:text-sm text-center underline transition-colors flex items-center justify-center gap-1 mt-1 
                                    ${foodList.length > 0 ? 'text-[#393027] cursor-pointer hover:opacity-70' : 'text-[#393027]/40 cursor-not-allowed no-underline'}`}
                                href="#"
                                onClick={handleClearAllClick}
                            >
                                <FaTrashAlt /> ล้างรายการทั้งหมด
                            </a>
                        </div>
                    </form>

                    <div className='mt-5 sm:mt-6 border-t border-[#CABCCD]/60 pt-5 sm:pt-6'>
                        <div className='flex justify-between items-end mb-3'>
                            <p className='text-[#393027] font-semibold flex items-center gap-2 text-sm sm:text-base'>
                                {/* ไอคอนรายการเมนู เปลี่ยนเป็นสีชมพู */}
                                <MdFormatListBulleted className="text-[#c89cab] text-xl" />
                                รายการเมนู ({foodList.length})
                            </p>
                        </div>
                        
                        <div id='listFood' className='bg-[#a4b5bf] p-3 sm:p-4 rounded-xl min-h-[120px] max-h-[250px] overflow-y-auto shadow-inner'>
                            {foodList.length === 0 ? (
                                <div className='h-full flex flex-col items-center justify-center text-[#393027]/40 gap-2 mt-4'>
                                    <MdOutlineRestaurant className="text-3xl sm:text-4xl" />
                                    <p className='text-sm sm:text-base'>ยังไม่มีรายการอาหาร</p>
                                </div>
                            ) : (
                                <ul className='space-y-2'>
                                    {foodList.map((food, index) => (
                                        <li key={index} className='flex items-center justify-between text-[#393027] bg-[#F0EEE9] px-2 sm:px-3 py-2 rounded-lg shadow-sm min-h-[44px] text-sm sm:text-base'>
                                            
                                            {editingIndex === index ? (
                                                <form onSubmit={(e) => saveEdit(e, index)} className="flex items-center gap-2 w-full">
                                                    <span className='bg-[#393027] text-[#F0EEE9] font-bold text-xs rounded-full min-w-[24px] h-6 flex items-center justify-center px-1'>
                                                        {index + 1}
                                                    </span>
                                                    <input 
                                                        type="text" 
                                                        value={editingValue} 
                                                        onChange={(e) => setEditingValue(e.target.value)}
                                                        className="flex-1 w-full px-2 py-1 text-sm border-b-2 border-[#393027] focus:outline-none bg-transparent min-w-0"
                                                        autoFocus
                                                    />
                                                    <div className="flex gap-1 shrink-0">
                                                        <button 
                                                            type="submit" 
                                                            className='text-[#9BAD50] hover:bg-[#9BAD50]/20 p-1.5 sm:p-2 rounded-full transition-colors'
                                                        >
                                                            <FaCheck />
                                                        </button>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => setEditingIndex(null)}
                                                            className='text-[#393027]/50 hover:bg-[#a4b5bf]/40 p-1.5 sm:p-2 rounded-full transition-colors'
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <>
                                                    <div className='flex items-center gap-2 sm:gap-3 overflow-hidden'>
                                                        <span className='bg-[#393027] text-[#F0EEE9] font-bold text-xs rounded-full min-w-[24px] h-6 flex items-center justify-center px-1 shrink-0'>
                                                            {index + 1}
                                                        </span>
                                                        <span className='truncate'>{food}</span>
                                                    </div>
                                                    
                                                    <div className='flex gap-1 shrink-0'>
                                                        <button 
                                                            onClick={() => startEditing(index, food)}
                                                            className='text-[#393027]/40 hover:text-[#a4b5bf] hover:bg-[#a4b5bf]/20 p-1.5 sm:p-2 rounded-full transition-colors focus:outline-none'
                                                        >
                                                            <FaPencilAlt />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleRemoveItem(index)}
                                                            className='text-[#393027]/40 hover:text-red-500 hover:bg-red-100 p-1.5 sm:p-2 rounded-full transition-colors focus:outline-none'
                                                        >
                                                            <FaTrashAlt />
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        
                        <button 
                            onClick={handleRandomClick}
                            // ปุ่มสุ่มเลย เปลี่ยนเป็นสีน้ำตาล ตัวหนังสือสีขาว
                            className={`rounded-lg w-full h-[50px] sm:h-[54px] mt-5 sm:mt-6 font-bold text-base sm:text-lg shadow-md transition-all flex items-center justify-center gap-2
                                ${foodList.length > 0 
                                    ? 'bg-[#393027] text-white hover:opacity-90 hover:shadow-lg active:scale-95' 
                                    : 'bg-[#393027]/50 text-white cursor-not-allowed shadow-none'
                                }`} 
                            type='button'
                            disabled={foodList.length === 0}
                        >
                            <FaMagic /> สุ่มเลย!
                        </button>
                    </div>
                </div>
            </main>

            {/* ================= MODALS / POPUPS ================= */}

            {showAlertPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity px-4">
                    <div className="bg-[#F0EEE9] rounded-2xl p-6 w-full max-w-[350px] shadow-2xl transform text-center animate-[bounce_0.3s_ease-out]">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#a4b5bf]/30 text-[#a4b5bf] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl sm:text-3xl">
                            <FaExclamationTriangle />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-[#393027] mb-2">ข้อมูลซ้ำ!</h3>
                        <p className="text-[#393027]/70 text-xs sm:text-sm mb-6">{alertMessage}</p>
                        <button 
                            onClick={() => setShowAlertPopup(false)} 
                            className="bg-[#393027] text-[#F0EEE9] font-semibold rounded-lg w-full h-[40px] hover:opacity-90 transition-opacity active:scale-95 text-sm sm:text-base"
                        >
                            รับทราบ
                        </button>
                    </div>
                </div>
            )}

            {showClearConfirmPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity px-4">
                    <div className="bg-[#F0EEE9] rounded-2xl p-6 w-full max-w-[350px] shadow-2xl transform text-center animate-[bounce_0.3s_ease-out]">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#a4b5bf]/30 text-[#a4b5bf] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl sm:text-3xl">
                            <FaTrashAlt />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-[#393027] mb-2">ยืนยันการล้างข้อมูล?</h3>
                        <p className="text-[#393027]/70 text-xs sm:text-sm mb-6">รายการอาหารทั้งหมดที่คุณเพิ่มไว้จะถูกลบ<br/>คุณแน่ใจหรือไม่?</p>
                        
                        <div className="flex gap-2 sm:gap-3">
                            <button 
                                onClick={() => setShowClearConfirmPopup(false)} 
                                className="bg-[#a4b5bf] text-[#393027] font-semibold rounded-lg w-full h-[40px] sm:h-[44px] hover:opacity-90 transition-colors active:scale-95 text-sm sm:text-base"
                            >
                                ยกเลิก
                            </button>
                            <button 
                                onClick={confirmClearAll} 
                                className="bg-[#393027] text-[#F0EEE9] font-semibold rounded-lg w-full h-[40px] sm:h-[44px] hover:opacity-90 transition-opacity active:scale-95 shadow-sm text-sm sm:text-base"
                            >
                                ยืนยันลบ
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showResultPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity px-4">
                    <div className="bg-[#F0EEE9] rounded-3xl p-6 sm:p-8 w-full max-w-[400px] shadow-2xl text-center flex flex-col items-center">
                        
                        {isRandomizing ? (
                            <div className="flex flex-col items-center w-full">
                                <FaDice className="text-5xl sm:text-6xl text-[#9BAD50] animate-spin mb-5 sm:mb-6" />
                                <h3 className="text-lg sm:text-xl font-bold text-[#393027] mb-4 flex items-center gap-2">
                                    <FaSpinner className="animate-spin text-[#9BAD50]" /> กำลังสุ่มเมนู...
                                </h3>
                                <div className="bg-[#9BAD50]/30 text-[#393027] font-extrabold text-2xl sm:text-3xl py-3 sm:py-4 px-4 sm:px-6 rounded-xl w-full truncate animate-pulse border border-[#a4b5bf]">
                                    {shufflingFood || '...'}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center w-full animate-[wiggle_1s_ease-in-out]">
                                <MdCelebration className="text-6xl sm:text-7xl text-[#9BAD50] mb-3 sm:mb-4 animate-bounce" />
                                <h3 className="text-base sm:text-lg text-[#393027]/70 font-medium mb-1 sm:mb-2">มื้อนี้คุณได้กิน...</h3>
                                <div className="text-3xl sm:text-4xl font-extrabold text-[#9BAD50] mb-6 sm:mb-8 py-2 break-words max-w-[100%] leading-tight">
                                    {selectedFood}
                                </div>
                                <button 
                                    onClick={() => setShowResultPopup(false)} 
                                    className="bg-[#393027] text-[#F0EEE9] font-bold rounded-xl w-full h-[46px] sm:h-[50px] hover:opacity-90 transition-colors active:scale-95 text-sm sm:text-base shadow-sm"
                                >
                                    ปิด
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            )}

        </div>
    );
};

export default Main;