import { format, startOfMonth } from 'date-fns';
import * as React from 'react';
import { useState } from 'react';
import * as ReactDOM from 'react-dom';
import { events } from '../stories/dummyEvents';
import {
  MonthlyCalendar,
  MonthlyDay,
  MonthlyBody,
  DefaultMonthlyEventItem,
} from '../src';
import '../dist/calendar-tailwind.css';

export const MyMonthlyCalendar = () => {
  let [currentMonth, setCurrentMonth] = useState<Date>(
    startOfMonth(new Date())
  );
  
  const [calendarList, setCalendarList] = useState<any | []>([
    {
      id: '1',
      name: 'meeting requirement 01',
      description: 'meeting di kantor',
      startTime: '09:00',
      endTime: '11:30',
      startDate: new Date('2022-05-09T00:00:00'),
      endDate: new Date('2022-05-10T00:00:00'),
      date: new Date('2022-05-09T00:00:00')
    },
    {
      id: '2',
      name: 'meeting requirement 02',
      description: 'meeting di kantor',
      startTime: '09:00',
      endTime: '11:30',
      startDate: new Date('2022-05-10T00:00:00'),
      endDate: new Date('2022-05-10T00:00:00'),
      date: new Date('2022-05-09T00:00:00')
    },
    {
      id: '3',
      name: 'meeting requirement 03',
      description: 'meeting di kantor',
      startTime: '09:00',
      endTime: '11:30',
      startDate: new Date('2022-05-10T00:00:00'),
      endDate: new Date('2022-05-11T00:00:00'),
      date: new Date('2022-05-09T00:00:00')
    }
  ])

  return (
    <MonthlyCalendar
      currentMonth={currentMonth}
      onCurrentMonthChange={(date) => setCurrentMonth(date)}
    >
      <MonthlyBody events={calendarList}>
        <MonthlyDay
          customRender={(day, dayNumber) => (
            <p
              style={{ padding: 10, backgroundColor: '#eee' }}
              onClick={() => console.log(day)}
            >
              {dayNumber}
            </p>
          )}
          renderDay={(data: any) => {
            return data.map((item, index) => (
              <div
                key={index}
                className={`p-2 rounded mb-2 hover:opacity-90 w-full cursor-pointer text-gray-600`}
                // onClick={() => {
                //   setActive(!active);
                //   setDataSelect(item);
                // }}
              >
                <p className="text-sm">{item?.name}</p>
                <p className="text-sm">
                  {item.startTime} - {item.endTime}
                </p>
              </div>
              // <DefaultMonthlyEventItem
              //   key={index}
              //   title={item.name}
              //   // Format the date here to be in the format you prefer
              //   date={format(item.date, 'k:mm')}/>
            ));
          }}
        />
      </MonthlyBody>
    </MonthlyCalendar>
  );
};

const App = () => {
  return (
    <div style={{margin: 'auto', padding: 20}}>
      <MyMonthlyCalendar />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
