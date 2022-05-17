import React, { ReactNode, useContext } from 'react'
import { useMonthlyCalendar } from './MonthlyCalendar'
import { daysInWeek } from '../shared'
import { format, getDay, getDaysInMonth, isSameDay, Locale } from 'date-fns'

const MonthlyBodyContext = React.createContext({} as any)
type BodyState<DayData> = {
  day: Date
  events: DayData[]
}

export function useMonthlyBody<DayData>() {
  return useContext<BodyState<DayData>>(MonthlyBodyContext)
}

type OmittedDaysProps = {
  days: Date[]
  omitDays?: number[]
  locale?: Locale
}

export const handleOmittedDays = ({
  days,
  omitDays,
  locale
}: OmittedDaysProps) => {
  let headings = daysInWeek({ locale })
  let daysToRender = days

  //omit the headings and days of the week that were passed in
  if (omitDays) {
    headings = daysInWeek({ locale }).filter(day => !omitDays.includes(day.day))
    daysToRender = days.filter(day => !omitDays.includes(getDay(day)))
  }

  // omit the padding if an omitted day was before the start of the month
  let firstDayOfMonth = getDay(daysToRender[0]) as number
  if (omitDays) {
    let subtractOmittedDays = omitDays.filter(
      day => day < firstDayOfMonth
    ).length
    firstDayOfMonth = firstDayOfMonth - subtractOmittedDays
  }
  let padding = new Array(firstDayOfMonth).fill(0)

  return { headings, daysToRender, padding }
}

//to prevent these from being purged in production, we make a lookup object
// const headingClasses = {
//   l3: 'lg:rc-grid-cols-2',
//   l4: 'lg:rc-grid-cols-3',
//   l5: 'lg:rc-grid-cols-4',
//   l6: 'lg:rc-grid-cols-5',
//   l7: 'lg:rc-grid-cols-7'
// }

type MonthlyBodyProps<DayData> = {
  /*
    skip days, an array of days, starts at sunday (0), saturday is 6
    ex: [0,6] would remove sunday and saturday from rendering
  */
  omitDays?: number[]
  events: (DayData & { date: Date; endDate: Date; startDate: Date })[]
  children: ReactNode
}

export function MonthlyBody<DayData>({
  omitDays,
  events,
  children
}: MonthlyBodyProps<DayData>) {
  let { days, locale } = useMonthlyCalendar()
  let { headings, daysToRender, padding } = handleOmittedDays({
    days,
    omitDays,
    locale
  })

  let underMonth = padding.map((_, index) => getDaysInMonth(new Date(days[0].getFullYear(), days[0].getMonth()-1)) - index).reverse()

  let mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

  let headingClassName = 'rc-text-center rc-p-2 lg:rc-block rc-font-semibold'
  let paddingClassName = 'rc-text-center rc-p-2 lg:rc-block rc-text-gray-600'
  return (
    <div className="rc-bg-white rc-rounded">
      <div
        className={`rc-grid rc-grid-cols-7 rc-overflow-hidden rc-overflow-y-auto`}
      >
        {headings.map(day => (
          <div
            key={day.day}
            className={headingClassName}
            aria-label="Day of Week"
          >
            {day.label.substring(0, mobile ? 1 : 3)}
          </div>
        ))}
        {padding.map((_, index) => (
          <div
            key={index}
            className={paddingClassName}
            aria-label="Empty Day"
          >
            {underMonth[index]}
          </div>
        ))}
        {daysToRender.map(day => (
          <MonthlyBodyContext.Provider
            key={day.toISOString()}
            value={{
              day,
              events: events.filter(
                item =>
                  new Date(day) <= new Date(item.endDate) &&
                  new Date(item.startDate) <= new Date(day)
              )
            }}
          >
            {children}
          </MonthlyBodyContext.Provider>
        ))}
      </div>
    </div>
  )
}

type MonthlyDayProps<DayData> = {
  renderDay: (events: DayData[]) => ReactNode
  customRender?: (day: Date, dayNumber: string) => ReactNode
}
export function MonthlyDay<DayData>({
  renderDay,
  customRender
}: MonthlyDayProps<DayData>) {
  let { locale } = useMonthlyCalendar()
  let { day, events } = useMonthlyBody<DayData>()
  let dayNumber = format(day, 'd', { locale })

  return (
    <div aria-label={`Events for day ${dayNumber}`} className="rc-p-2">
      <div className="rc-flex rc-justify-between">
        {!customRender && (
          <div className="rc-flex rc-flex-row rc-justify-between">
            <div
              className={`rc-font-normal rc-mb-2 md:rc-text-sm sm:rc-text-xs rc-text-xs ${
                isSameDay(day, new Date())
                  ? 'rc-bg-blue-500 rc-text-white rc-px-2 rc-rounded'
                  : ''
              }`}
            >
              {parseInt(dayNumber) < 10 ? '0' + dayNumber : dayNumber}
            </div>
          </div>
        )}
        {/* <div className="lg:rc-hidden rc-block">
          {format(day, 'EEEE', { locale })}
        </div> */}
      </div>
      <ul className="rc-divide-gray-200 rc-divide-y rc-overflow-hidden rc-max-h-36 md:rc-max-h-24 rc-overflow-y-auto">
        {customRender ? customRender(day, dayNumber) : renderDay(events)}
      </ul>
    </div>
  )
}
