'use client';

import DatePicker from '@/components/date-picker';
import React, { useState } from 'react'

import 'dayjs/locale/pt-BR';

const HomePage = () => {
    const [date, setDate] = useState<Date | null>(new Date());
    const [dateTime, setDateTime] = useState<Date | null>(new Date());

    return (
        <div className="flex justify-center items-center">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
                <div>
                    <p className="mt-3 text-gs1-base font-semibold text-gs1-blue-300">
                        simple variant
                    </p>

                    <DatePicker
                        clearable
                        inputtable
                        className="w-44"
                        disabled={false}
                        inputFormat="DD/MM/YYYY"
                        locale="pt-BR"
                        minDate={new Date()}
                        size="sm"
                        value={date}
                        onChange={(date: Date | null) => setDate(date)}
                    />
                </div>

                <div className='mt-4'>
                    <p className="mt-3 text-gs1-base font-semibold text-gs1-blue-300">
                        date-time variant
                    </p>
                    <DatePicker.DateTimepicker
                        clearable
                        inputtable
                        className="w-52"
                        disabled={false}
                        inputFormat="DD/MM/YYYY hh:mm"
                        locale="pt-BR"
                        minDate={new Date()}
                        size="sm"
                        value={dateTime}
                        onChange={(date: Date | null) => setDateTime(date)}
                    />
                </div>

                <div className='mt-4'>
                    <p className="mt-3 text-gs1-base font-semibold text-gs1-blue-300">
                        month variant
                    </p>

                    <DatePicker
                        clearable
                        inputtable
                        disabled={false}
                        inputFormat="MM/YYYY"
                        defaultView="month"
                        locale="pt-BR"
                        minDate={new Date()}
                        size="sm"
                        value={date}
                        onChange={(date: Date | null) => setDate(date)}
                    />
                </div>
                
            </main>
        </div>
    )
}

export default HomePage;