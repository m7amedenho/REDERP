// components/ui/date-picker.tsx
"use client"

import * as React from "react"
import { format, isBefore, isAfter, startOfDay, endOfDay } from "date-fns"
import { ar, enUS } from "date-fns/locale"
import { CalendarIcon, ChevronDownIcon, X } from "lucide-react"
import { DayPickerProps } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type DatePickerMode = "single" | "range"
export type DateFormat = "dd/MM/yyyy" | "MM/dd/yyyy" | "yyyy-MM-dd" | "PPP"
export type Locale = "ar" | "en"

export interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

export interface DatePickerProps {
  // Basic Props
  mode?: DatePickerMode
  selected?: Date | DateRange | undefined
  onSelect?: (date: Date | DateRange | undefined) => void
  disabled?: boolean
  required?: boolean
  className?: string
  
  // Label & ID
  label?: string
  id?: string
  placeholder?: string
  
  // Configuration
  dateFormat?: DateFormat
  locale?: Locale
  showTimePicker?: boolean
  showPresets?: boolean
  allowManualInput?: boolean
  clearable?: boolean
  
  // Validation
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  
  // Presets
  presets?: {
    label: string
    value: Date | DateRange
  }[]
  
  // Time Configuration (if showTimePicker is true)
  timeFormat?: "12h" | "24h"
}

const locales = {
  ar,
  en: enUS,
}

const dateFormats = {
  "dd/MM/yyyy": "dd/MM/yyyy",
  "MM/dd/yyyy": "MM/dd/yyyy", 
  "yyyy-MM-dd": "yyyy-MM-dd",
  "PPP": "PPP"
}

// إعدادات مسبقة بالعربية والإنجليزية
const defaultPresets = {
  ar: [
    { label: "اليوم", value: new Date() },
    { label: "غداً", value: new Date(Date.now() + 24 * 60 * 60 * 1000) },
    { label: "الأسبوع القادم", value: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  ],
  en: [
    { label: "Today", value: new Date() },
    { label: "Tomorrow", value: new Date(Date.now() + 24 * 60 * 60 * 1000) },
    { label: "Next Week", value: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  ]
}

export function DatePicker({
  // Basic Props
  mode = "range",
  selected,
  onSelect,
  disabled = false,
  required = false,
  className,
  
  // Label & ID
  label,
  id = "date-picker",
  placeholder,
  
  // Configuration
  dateFormat = "dd/MM/yyyy",
  locale = "en",
  showTimePicker = false,
  showPresets = true,
  allowManualInput = true,
  clearable = true,
  
  // Validation
  minDate,
  maxDate,
  disabledDates,
  
  // Presets
  presets,
  
  // Time Configuration
  timeFormat = "24h",
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [month, setMonth] = React.useState<Date | undefined>(
    mode === "single" 
      ? (selected as Date) || new Date()
      : (selected as DateRange)?.from || new Date()
  )
  const [time, setTime] = React.useState<string>("00:00")

  // استخدام الإعدادات المسبقة المناسبة للغة
  const currentPresets = presets || defaultPresets[locale]

  // Initialize time if selected date has time
  React.useEffect(() => {
    if (showTimePicker && selected) {
      if (mode === "single" && selected) {
        const date = selected as Date
        setTime(format(date, "HH:mm"))
      } else if (mode === "range" && selected) {
        const range = selected as DateRange
        if (range.from) {
          setTime(format(range.from, "HH:mm"))
        }
      }
    }
  }, [selected, mode, showTimePicker])

  const handleSelect = React.useCallback((date: Date | DateRange | undefined) => {
    if (showTimePicker && date) {
      if (mode === "single" && date) {
        const selectedDate = date as Date
        const [hours, minutes] = time.split(":").map(Number)
        const dateWithTime = new Date(selectedDate)
        dateWithTime.setHours(hours, minutes)
        onSelect?.(dateWithTime)
      } else if (mode === "range" && date) {
        const range = date as DateRange
        if (range.from) {
          const [hours, minutes] = time.split(":").map(Number)
          const fromWithTime = new Date(range.from)
          fromWithTime.setHours(hours, minutes)
          
          let toWithTime: Date | undefined
          if (range.to) {
            toWithTime = new Date(range.to)
            toWithTime.setHours(hours, minutes)
          }
          
          onSelect?.({ from: fromWithTime, to: toWithTime })
        } else {
          onSelect?.(range)
        }
      }
    } else {
      onSelect?.(date)
    }
  }, [onSelect, mode, showTimePicker, time])

  const handleClear = () => {
    onSelect?.(undefined)
    setOpen(false)
  }

  const handlePresetSelect = (preset: Date | DateRange) => {
    if (showTimePicker) {
      // Apply current time to preset dates
      if (mode === "single") {
        const date = preset as Date
        const [hours, minutes] = time.split(":").map(Number)
        const dateWithTime = new Date(date)
        dateWithTime.setHours(hours, minutes)
        onSelect?.(dateWithTime)
      } else {
        const range = preset as DateRange
        if (range.from && range.to) {
          const [hours, minutes] = time.split(":").map(Number)
          const fromWithTime = new Date(range.from)
          const toWithTime = new Date(range.to)
          fromWithTime.setHours(hours, minutes)
          toWithTime.setHours(hours, minutes)
          onSelect?.({ from: fromWithTime, to: toWithTime })
        }
      }
    } else {
      onSelect?.(preset)
    }
    setOpen(false)
  }

  const formatDisplayDate = (date: Date | DateRange | undefined): string => {
    if (!date) {
      return placeholder || 
        (mode === "single" 
          ? (locale === "ar" ? "اختر تاريخ" : "Select date")
          : (locale === "ar" ? "اختر مدى تاريخي" : "Select date range")
        )
    }
    
    const localeObj = locales[locale]
    
    if (mode === "single") {
      const singleDate = date as Date
      return format(singleDate, dateFormats[dateFormat], { locale: localeObj })
    } else {
      const range = date as DateRange
      if (range.from && range.to) {
        return `${format(range.from, dateFormats[dateFormat], { locale: localeObj })} - ${format(range.to, dateFormats[dateFormat], { locale: localeObj })}`
      } else if (range.from) {
        return `${format(range.from, dateFormats[dateFormat], { locale: localeObj })} - ...`
      }
      return placeholder || (locale === "ar" ? "اختر مدى تاريخي" : "Select date range")
    }
  }

  const handleManualInput = (value: string) => {
    try {
      let parsedDate: Date | undefined
      
      if (dateFormat === "dd/MM/yyyy") {
        const [day, month, year] = value.split("/").map(Number)
        if (day && month && year) {
          parsedDate = new Date(year, month - 1, day)
        }
      } else if (dateFormat === "MM/dd/yyyy") {
        const [month, day, year] = value.split("/").map(Number)
        if (day && month && year) {
          parsedDate = new Date(year, month - 1, day)
        }
      } else if (dateFormat === "yyyy-MM-dd") {
        parsedDate = new Date(value)
      }
      
      if (parsedDate && !isNaN(parsedDate.getTime())) {
        // Validate against min/max dates
        if (minDate && isBefore(parsedDate, startOfDay(minDate))) return
        if (maxDate && isAfter(parsedDate, endOfDay(maxDate))) return
        
        // Validate against disabled dates
        if (disabledDates?.some(disabledDate => 
          format(disabledDate, "yyyy-MM-dd") === format(parsedDate!, "yyyy-MM-dd")
        )) return
        
        if (showTimePicker) {
          const [hours, minutes] = time.split(":").map(Number)
          parsedDate.setHours(hours, minutes)
        }
        
        onSelect?.(parsedDate)
      }
    } catch (error) {
      // Invalid date input, do nothing
      console.error('Invalid date input:', error)
    }
  }

  const renderTimePicker = () => {
    if (!showTimePicker) return null

    const hours = Array.from({ length: timeFormat === "24h" ? 24 : 12 }, (_, i) => 
      timeFormat === "24h" ? i : i + 1
    )
    const minutes = Array.from({ length: 60 }, (_, i) => i)

    return (
      <div className={cn(
        "flex gap-2 p-3 border-t",
        locale === "ar" && "flex-row-reverse"
      )}>
        <div className="flex-1">
          <Label htmlFor="hours" className="text-xs">
            {locale === "ar" ? "الساعات" : "Hours"}
          </Label>
          <Select
            value={time.split(":")[0]}
            onValueChange={(value) => {
              const [_, currentMinutes] = time.split(":")
              setTime(`${value}:${currentMinutes}`)
            }}
          >
            <SelectTrigger className="h-8" dir={locale === "ar" ? "rtl" : "ltr"}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {hours.map(hour => (
                <SelectItem key={hour} value={hour.toString().padStart(2, '0')}>
                  {hour.toString().padStart(2, '0')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Label htmlFor="minutes" className="text-xs">
            {locale === "ar" ? "الدقائق" : "Minutes"}
          </Label>
          <Select
            value={time.split(":")[1]}
            onValueChange={(value) => {
              const [currentHours] = time.split(":")
              setTime(`${currentHours}:${value}`)
            }}
          >
            <SelectTrigger className="h-8" dir={locale === "ar" ? "rtl" : "ltr"}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {minutes.map(minute => (
                <SelectItem key={minute} value={minute.toString().padStart(2, '0')}>
                  {minute.toString().padStart(2, '0')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {timeFormat === "12h" && (
          <div className="flex-1">
            <Label htmlFor="ampm" className="text-xs">AM/PM</Label>
            <Select
              value={parseInt(time.split(":")[0]) >= 12 ? "PM" : "AM"}
              onValueChange={(value) => {
                const [hours, minutes] = time.split(":").map(Number)
                let newHours = hours
                if (value === "PM" && hours < 12) newHours += 12
                if (value === "AM" && hours >= 12) newHours -= 12
                setTime(`${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`)
              }}
            >
              <SelectTrigger className="h-8" dir={locale === "ar" ? "rtl" : "ltr"}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    )
  }

  const renderPresets = () => {
    if (!showPresets) return null

    return (
      <div className="p-3 border-t">
        <Label className="text-sm font-medium mb-2 block">
          {locale === "ar" ? "اختيار سريع" : "Quick Select"}
        </Label>
        <div className={cn(
          "flex flex-wrap gap-2",
          locale === "ar" && "flex-row-reverse"
        )}>
          {currentPresets.map((preset, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => handlePresetSelect(preset.value)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>
    )
  }

  // Determine if we should show clear button
  const shouldShowClear = clearable && 
    (mode === "single" ? selected !== undefined : 
     (selected as DateRange)?.from !== undefined)

  // Handle input click to open popover
  const handleInputClick = () => {
    if (!disabled) {
      setOpen(true)
    }
  }

  return (
    <div className={cn(
      "flex flex-col gap-2",
      locale === "ar" && "text-right",
      className
    )}>
      {label && (
        <Label htmlFor={id} className="px-1 text-sm font-medium">
          {label}
          {required && <span className="text-destructive mr-1">*</span>}
        </Label>
      )}
      
      <div className="relative">
        {allowManualInput ? (
          <div className="relative">
            <Input
              id={id}
              value={formatDisplayDate(selected)}
              placeholder={placeholder || 
                (mode === "single" 
                  ? (locale === "ar" ? "اختر تاريخ" : "Select date")
                  : (locale === "ar" ? "اختر مدى تاريخي" : "Select date range")
                )
              }
              className={cn(
                "bg-background pr-10",
                disabled && "opacity-50 cursor-not-allowed",
                locale === "ar" && "text-right pl-10 pr-3"
              )}
              disabled={disabled}
              onChange={(e) => handleManualInput(e.target.value)}
              onClick={handleInputClick}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault()
                  setOpen(true)
                }
              }}
              readOnly={!allowManualInput}
            />
            
            {/* Calendar trigger for manual input mode */}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 h-6 w-6",
                    locale === "ar" ? "left-2" : "right-2"
                  )}
                  disabled={disabled}
                >
                  <CalendarIcon className="h-3.5 w-3.5" />
                  <span className="sr-only">
                    {locale === "ar" ? "اختر تاريخ" : "Select date"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-auto p-0" 
                align={locale === "ar" ? "end" : "start"}
                dir={locale}
              >
                <Calendar
                  mode={mode}
                  selected={selected}
                  onSelect={handleSelect}
                  month={month}
                  onMonthChange={setMonth}
                  disabled={(date) => {
                    if (minDate && isBefore(date, startOfDay(minDate))) return true
                    if (maxDate && isAfter(date, endOfDay(maxDate))) return true
                    if (disabledDates?.some(disabledDate =>
                      format(disabledDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
                    )) return true
                    return false
                  }}
                  locale={locales[locale]}
                  required
                  className="p-3"
                  dir={locale}
                />
                {renderTimePicker()}
                {renderPresets()}
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                id={id}
                variant="outline"
                disabled={disabled}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selected && "text-muted-foreground",
                  locale === "ar" && "flex-row-reverse text-right"
                )}
              >
                {formatDisplayDate(selected)}
                <ChevronDownIcon className={cn(
                  "h-4 w-4 opacity-50",
                  locale === "ar" ? "mr-auto" : "ml-auto"
                )} />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-auto p-0" 
              align={locale === "ar" ? "end" : "start"}
              dir={locale}
            >
              <Calendar
                mode={mode}
                selected={selected}
                onSelect={handleSelect}
                month={month}
                onMonthChange={setMonth}
                disabled={(date) => {
                  if (minDate && isBefore(date, startOfDay(minDate))) return true
                  if (maxDate && isAfter(date, endOfDay(maxDate))) return true
                  if (disabledDates?.some(disabledDate =>
                    format(disabledDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
                  )) return true
                  return false
                }}
                locale={locales[locale]}
                className="p-3"
                dir={locale}
              />
              {renderTimePicker()}
              {renderPresets()}
            </PopoverContent>
          </Popover>
        )}

        {/* Clear button */}
        {shouldShowClear && allowManualInput && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-1/2 -translate-y-1/2 h-6 w-6",
              locale === "ar" ? "right-8" : "left-8"
            )}
            onClick={handleClear}
            disabled={disabled}
          >
            <X className="h-3.5 w-3.5" />
            <span className="sr-only">
              {locale === "ar" ? "مسح" : "Clear"}
            </span>
          </Button>
        )}
      </div>
    </div>
  )
}

// Hook for using the date picker in forms
export function useDatePicker(initialValue?: Date | DateRange) {
  const [selected, setSelected] = React.useState<Date | DateRange | undefined>(initialValue)

  return {
    selected,
    setSelected,
    props: {
      selected,
      onSelect: setSelected,
    },
  }
}