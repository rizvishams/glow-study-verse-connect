
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay } from "date-fns";

interface StudyEvent {
  id: number;
  date: Date;
  title: string;
  subject: string;
  time: string;
  duration: string;
  participants?: string[];
}

const StudyCalendar: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  
  // Sample study events
  const studyEvents: StudyEvent[] = [
    {
      id: 1,
      date: new Date(2025, 4, 8), // May 8, 2025
      title: "JavaScript Review",
      subject: "Web Development",
      time: "3:00 PM",
      duration: "1 hour",
      participants: ["Alex Johnson"]
    },
    {
      id: 2,
      date: new Date(2025, 4, 10), // May 10, 2025
      title: "Data Structures Practice",
      subject: "Computer Science",
      time: "5:30 PM",
      duration: "1.5 hours",
      participants: ["Sarah Parker"]
    },
    {
      id: 3,
      date: new Date(2025, 4, 15), // May 15, 2025
      title: "Machine Learning Concepts",
      subject: "AI & ML",
      time: "4:00 PM",
      duration: "2 hours",
      participants: ["Michael Lee"]
    },
    {
      id: 4, 
      date: new Date(), // Today
      title: "Study Planning Session",
      subject: "General",
      time: "6:00 PM",
      duration: "1 hour"
    }
  ];
  
  // Find events for the selected date
  const selectedDateEvents = studyEvents.filter(event => 
    isSameDay(event.date, date)
  );

  // Customize day rendering to show event indicators
  const renderDay = (day: Date) => {
    const hasEvent = studyEvents.some(event => isSameDay(day, event.date));
    return hasEvent ? <Badge variant="outline" className="w-1 h-1 rounded-full bg-neon-purple p-0" /> : null;
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-neon-pink">Study Calendar</CardTitle>
        <CardDescription>Schedule and manage your study sessions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Calendar 
          mode="single"
          selected={date}
          onSelect={(newDate) => newDate && setDate(newDate)}
          className="rounded-md p-3 bg-white/5 border border-white/10 pointer-events-auto"
          components={{
            DayContent: (props) => (
              <div className="relative flex justify-center items-center">
                {props.day.toString()}
                <div className="absolute -bottom-1">
                  {renderDay(props.date)}
                </div>
              </div>
            )
          }}
        />
        
        <div className="mt-4">
          <h3 className="text-white font-medium mb-2">
            {format(date, "MMMM d, yyyy")}
          </h3>
          
          {selectedDateEvents.length > 0 ? (
            <div className="space-y-3">
              {selectedDateEvents.map(event => (
                <div 
                  key={event.id} 
                  className="p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex justify-between">
                    <h4 className="font-medium text-white">{event.title}</h4>
                    <span className="text-neon-cyan text-sm">{event.time}</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {event.subject} • {event.duration}
                  </p>
                  {event.participants && (
                    <div className="mt-2 text-xs text-gray-400">
                      With: {event.participants.join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400 bg-white/5 rounded-lg border border-white/10">
              No study sessions scheduled for this day
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyCalendar;
