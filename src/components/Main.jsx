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

    // States ควบคุม Popups
    const [showAlertPopup, setShowAlertPopup] = useState(false);
    const [alertMessage, setAlertMessage] = useState(''); // เพิ่ม State เก็บข้อความแจ้งเตือนที่เปลี่ยนไปตามบริบท
    const [showClearConfirmPopup, setShowClearConfirmPopup] = useState(false);
    
    // States สำหรับระบบสุ่ม
    const [isRandomizing, setIsRandomizing] = useState(false);
    const [showResultPopup, setShowResultPopup] = useState(false);
    const [shufflingFood, setShufflingFood] = useState(''); 
    const [selectedFood, setSelectedFood] = useState(''); 

    // ฟังก์ชันเพิ่มเมนู
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

    // ฟังก์ชันบันทึกการแก้ไขเมนู
    const saveEdit = (e, index) => {
        e.preventDefault();
        const trimmedValue = editingValue.trim();

        if (trimmedValue === '') {
            setEditingIndex(null);
            return;
        }

        // เช็คว่าชื่อที่แก้ใหม่ ไปซ้ำกับรายการอื่น (i !== index) ที่มีอยู่แล้วหรือไม่
        const isDuplicate = foodList.some((item, i) => i !== index && item === trimmedValue);
        
        if (isDuplicate) {
            // ถ้าซ้ำ ให้แสดง Popup แจ้งเตือนและหยุดการทำงาน (ไม่อัปเดตข้อมูล)
            setAlertMessage('ชื่อเมนูนี้มีอยู่ในรายการแล้ว โปรดใช้ชื่ออื่น');
            setShowAlertPopup(true);
            return; 
        }

        const newList = [...foodList];
        newList[index] = trimmedValue;
        setFoodList(newList);
        setEditingIndex(null);
    };

    // ฟังก์ชันสุ่มอาหาร
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
        <div className='bg-white shadow-2xl rounded-2xl w-[500px] p-8 border border-gray-100 font-sans relative'>
            
            {/* Header */}
            <header className='text-center uppercase font-extrabold mb-6'>
                <div className="text-3xl bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center gap-3">
                    <MdRestaurantMenu className="text-orange-500" /> 
                    <span>Random Food</span>
                    <FaDice className="text-red-500" />
                </div>
                <p className='text-gray-400 text-sm mt-1 normal-case'>สุ่มเมนูอาหารมื้อนี้กินอะไรดี?</p>
            </header>

            <main>
                <div className="container">
                    <form className='flex flex-col' onSubmit={handleAddFood}>
                        <label className='mb-2'>
                            <p className='mb-2 text-gray-700 font-medium'>กรุณากรอกชื่อเมนูที่ต้องการให้สุ่ม :</p>
                            <input 
                                className='bg-gray-50 text-gray-800 px-4 py-2 border border-gray-300 rounded-lg w-full h-[48px] focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all' 
                                type="text" 
                                placeholder='เช่น ข้าวกะเพรา บะหมี่หมูกรอบ, สุกี้' 
                                value={inputValue} 
                                onChange={(e) => setInputValue(e.target.value)} 
                            />
                        </label>
                        
                        <div className="flex flex-col gap-3 mt-2">
                            <button 
                                type="submit" 
                                className='bg-orange-500 text-white font-semibold rounded-lg w-full h-[48px] shadow-md hover:bg-orange-600 hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2'
                            >
                                <FaPlus /> เพิ่มเมนูอาหาร
                            </button>
                            
                            <a 
                                className={`text-sm text-center underline transition-colors flex items-center justify-center gap-1 mt-1 
                                    ${foodList.length > 0 ? 'text-gray-400 cursor-pointer hover:text-red-500' : 'text-gray-300 cursor-not-allowed no-underline'}`}
                                href="#"
                                onClick={handleClearAllClick}
                            >
                                <FaTrashAlt /> ล้างรายการทั้งหมด
                            </a>
                        </div>
                    </form>

                    <div className='mt-6 border-t border-gray-100 pt-6'>
                        <div className='flex justify-between items-end mb-3'>
                            <p className='text-gray-700 font-semibold flex items-center gap-2'>
                                <MdFormatListBulleted className="text-orange-500 text-xl" />
                                รายการเมนู ({foodList.length})
                            </p>
                        </div>
                        
                        {/* กล่องแสดงรายการอาหาร */}
                        <div id='listFood' className='bg-gray-50 border border-gray-200 p-4 rounded-xl min-h-[120px] max-h-[250px] overflow-y-auto shadow-inner'>
                            {foodList.length === 0 ? (
                                <div className='h-full flex flex-col items-center justify-center text-gray-400 gap-2 mt-4'>
                                    <MdOutlineRestaurant className="text-4xl text-gray-300" />
                                    <p>ยังไม่มีรายการอาหาร</p>
                                </div>
                            ) : (
                                <ul className='space-y-2'>
                                    {foodList.map((food, index) => (
                                        <li key={index} className='flex items-center justify-between text-gray-700 bg-white px-3 py-2 rounded-lg border border-gray-100 shadow-sm min-h-[44px]'>
                                            
                                            {editingIndex === index ? (
                                                <form onSubmit={(e) => saveEdit(e, index)} className="flex items-center gap-2 w-full">
                                                    <span className='bg-orange-100 text-orange-600 font-bold text-xs rounded-full min-w-[24px] h-6 flex items-center justify-center px-1'>
                                                        {index + 1}
                                                    </span>
                                                    <input 
                                                        type="text" 
                                                        value={editingValue} 
                                                        onChange={(e) => setEditingValue(e.target.value)}
                                                        className="flex-1 px-2 py-1 text-sm border-b-2 border-orange-400 focus:outline-none bg-gray-50"
                                                        autoFocus
                                                    />
                                                    <div className="flex gap-1">
                                                        <button 
                                                            type="submit" 
                                                            className='text-green-500 hover:bg-green-50 p-2 rounded-full transition-colors'
                                                            title="บันทึก"
                                                        >
                                                            <FaCheck />
                                                        </button>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => setEditingIndex(null)}
                                                            className='text-gray-400 hover:bg-gray-50 p-2 rounded-full transition-colors'
                                                            title="ยกเลิก"
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <>
                                                    <div className='flex items-center gap-3 overflow-hidden'>
                                                        <span className='bg-orange-100 text-orange-600 font-bold text-xs rounded-full min-w-[24px] h-6 flex items-center justify-center px-1 shrink-0'>
                                                            {index + 1}
                                                        </span>
                                                        <span className='truncate'>{food}</span>
                                                    </div>
                                                    
                                                    <div className='flex gap-1 shrink-0'>
                                                        <button 
                                                            onClick={() => startEditing(index, food)}
                                                            className='text-gray-400 hover:text-orange-500 hover:bg-orange-50 p-2 rounded-full transition-colors focus:outline-none'
                                                            title="แก้ไขเมนูนี้"
                                                        >
                                                            <FaPencilAlt />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleRemoveItem(index)}
                                                            className='text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors focus:outline-none'
                                                            title="ลบเมนูนี้"
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
                            className={`rounded-lg w-full h-[54px] mt-6 font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2
                                ${foodList.length > 0 
                                    ? 'bg-gradient-to-r from-green-400 to-emerald-600 text-white hover:from-green-500 hover:to-emerald-700 hover:shadow-xl active:scale-95' 
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
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

            {/* 1. Popup แจ้งเตือนเมนูซ้ำ (ใช้แสดงข้อความจาก State alertMessage) */}
            {showAlertPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-2xl p-6 w-[350px] shadow-2xl transform text-center animate-[bounce_0.3s_ease-out]">
                        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                            <FaExclamationTriangle />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">ข้อมูลซ้ำ!</h3>
                        {/* ดึงข้อความมาแสดงตรงนี้ */}
                        <p className="text-gray-500 text-sm mb-6">{alertMessage}</p>
                        <button 
                            onClick={() => setShowAlertPopup(false)} 
                            className="bg-gray-800 text-white font-semibold rounded-lg w-full h-[40px] hover:bg-gray-900 transition-colors active:scale-95"
                        >
                            รับทราบ
                        </button>
                    </div>
                </div>
            )}

            {/* 2. Popup ยืนยันการล้างรายการทั้งหมด */}
            {showClearConfirmPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-2xl p-6 w-[350px] shadow-2xl transform text-center animate-[bounce_0.3s_ease-out]">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                            <FaTrashAlt />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">ยืนยันการล้างข้อมูล?</h3>
                        <p className="text-gray-500 text-sm mb-6">รายการอาหารทั้งหมดที่คุณเพิ่มไว้จะถูกลบ<br/>คุณแน่ใจหรือไม่?</p>
                        
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowClearConfirmPopup(false)} 
                                className="bg-gray-100 text-gray-700 font-semibold rounded-lg w-full h-[44px] hover:bg-gray-200 transition-colors active:scale-95"
                            >
                                ยกเลิก
                            </button>
                            <button 
                                onClick={confirmClearAll} 
                                className="bg-red-500 text-white font-semibold rounded-lg w-full h-[44px] hover:bg-red-600 transition-colors active:scale-95 shadow-md"
                            >
                                ยืนยันลบ
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Popup สุ่มเมนูอาหาร */}
            {showResultPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity">
                    <div className="bg-white rounded-3xl p-8 w-[400px] shadow-2xl text-center flex flex-col items-center">
                        
                        {isRandomizing ? (
                            <div className="flex flex-col items-center w-full">
                                <FaDice className="text-6xl text-orange-500 animate-spin mb-6" />
                                <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                                    <FaSpinner className="animate-spin text-orange-500" /> กำลังสุ่มเมนู...
                                </h3>
                                <div className="bg-orange-100 text-orange-600 font-extrabold text-3xl py-4 px-6 rounded-xl w-full truncate animate-pulse">
                                    {shufflingFood || '...'}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center w-full animate-[wiggle_1s_ease-in-out]">
                                <MdCelebration className="text-7xl text-emerald-500 mb-4 animate-bounce" />
                                <h3 className="text-lg text-gray-500 font-medium mb-2">มื้อนี้คุณได้กิน...</h3>
                                <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600 mb-8 py-2 break-words max-w-[100%]">
                                    {selectedFood}
                                </div>
                                <button 
                                    onClick={() => setShowResultPopup(false)} 
                                    className="bg-gray-100 text-gray-700 font-bold rounded-xl w-full h-[50px] hover:bg-gray-200 transition-colors active:scale-95"
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