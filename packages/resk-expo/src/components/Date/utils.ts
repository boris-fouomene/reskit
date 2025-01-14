import "./utils.common";
import * as React from 'react';
import { DEFAULT_DATE_FORMATS, formatDate, IMomentFormat, isDateObj, isValidDate } from "@resk/core";
import { useI18n } from "@src/i18n";

export const toDateObj = (value: any, format?: IMomentFormat, force?: boolean) => {
  if (!value) return undefined;
  if (Array.isArray(value)) {
    value = value[0] || value[1];
  }
  if (isDateObj(value)) return value;
  try {
    const d = new Date(value);
    if (isValidDate(d)) return d;
  } catch { }
  return undefined;
}

export const compareTwoDates = (a: any, b: any) => {
  if (!a && !b && a === b) return true;
  return a && b && a.getTime && b.getTime && a.getTime() === b.getTime()
}


export function differenceInMonths(firstDate: Date, secondDate: Date) {
  let diffMonths = (secondDate.getFullYear() - firstDate.getFullYear()) * 12
  diffMonths -= firstDate.getMonth()
  diffMonths += secondDate.getMonth()
  return diffMonths
}
export function useInputFormat(locale: string) {
  return React.useMemo(() => {
    return DEFAULT_DATE_FORMATS.date;
  }, [locale])
}
export function useDateInput({ locale, value, inputMode, onChange }: { locale: string, value: any, inputMode?: string, onChange?: any }) {
  const [error, setError] = React.useState<string>("")
  const inputFormat = useInputFormat(locale)
  const formattedValue = formatDate(value);
  const i18n = useI18n();
  const onChangeText = (date: string) => {
    const dayIndex = inputFormat.indexOf('DD')
    const monthIndex = inputFormat.indexOf('MM')
    const yearIndex = inputFormat.indexOf('YYYY')
    const day = Number(date.slice(dayIndex, dayIndex + 2))
    const year = Number(date.slice(yearIndex, yearIndex + 4))
    const month = Number(date.slice(monthIndex, monthIndex + 2))
    if (Number.isNaN(day) || Number.isNaN(year) || Number.isNaN(month)) {
      setError(i18n.t('notAccordingToDateFormat'))
      return
    }
    const finalDate =
      inputMode === 'end'
        ? new Date(year, month - 1, day, 23, 59, 59)
        : new Date(year, month - 1, day)
    setError("");
    if (inputMode === 'end') {
      onChange(finalDate)
    } else {
      onChange(finalDate)
    }
  }
  return {
    onChange,
    error,
    formattedValue,
    onChangeText,
    inputFormat,
  }
}

