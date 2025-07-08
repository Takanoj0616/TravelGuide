import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useTranslation } from 'react-i18next';

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
}

interface CalendarProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
  onDateSelect?: (start: Date, end: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  events,
  onEventClick,
  onDateSelect,
}) => {
  const { i18n } = useTranslation();

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        locale={i18n.language}
        events={events}
        eventClick={(info) => {
          const event = events.find(e => e.id === info.event.id);
          if (event && onEventClick) {
            onEventClick(event);
          }
        }}
        selectable={true}
        select={(info) => {
          if (onDateSelect) {
            onDateSelect(info.start, info.end);
          }
        }}
        height="auto"
        allDaySlot={false}
        slotMinTime="08:00:00"
        slotMaxTime="22:00:00"
        slotDuration="00:30:00"
      />
    </div>
  );
}; 