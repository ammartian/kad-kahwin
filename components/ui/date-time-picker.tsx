"use client"

import * as React from "react"
import { format, parseISO, isValid } from "date-fns"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateTimePickerProps {
  date: string
  onDateChange: (value: string) => void
  time: string
  onTimeChange: (value: string) => void
  dateLabel?: string
  timeLabel?: string
  labelClassName?: string
  disabled?: boolean
}

export function DateTimePicker({
  date,
  onDateChange,
  time,
  onTimeChange,
  dateLabel = "Date",
  timeLabel = "Time",
  labelClassName = "text-sm font-medium",
  disabled,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)

  const selectedDate = React.useMemo(() => {
    if (!date) return undefined
    const parsed = parseISO(date)
    return isValid(parsed) ? parsed : undefined
  }, [date])

  function handleSelect(d: Date | undefined) {
    if (!d) return
    onDateChange(format(d, "yyyy-MM-dd"))
    setOpen(false)
  }

  return (
    <div className="flex gap-2">
      <div className="flex-1 space-y-2">
        <label className={labelClassName}>{dateLabel}</label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              disabled={disabled}
              className="w-full justify-between font-normal"
            >
              {selectedDate ? format(selectedDate, "d MMM yyyy") : "Select date"}
              <ChevronDownIcon className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              captionLayout="dropdown"
              navLayout="around"
              defaultMonth={selectedDate}
              onSelect={handleSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="w-32 space-y-2">
        <label className={labelClassName}>{timeLabel}</label>
        <Input
          type="time"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          disabled={disabled}
          className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  )
}
