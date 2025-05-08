
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

export interface Notification {
  id: string;
  type: 'message' | 'connection' | 'reminder' | 'system';
  title: string;
  content: string;
  time: Date;
  read: boolean;
  action?: {
    text: string;
    url: string;
    data?: any;
  };
}

interface NotificationSystemProps {
  onJoinMeeting?: (sessionData: any) => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ onJoinMeeting }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Simulate getting notifications
  useEffect(() => {
    // Demo notifications
    const demoNotifications: Notification[] = [
      {
        id: '1',
        type: 'connection',
        title: 'New Connection Request',
        content: 'Emma Thompson wants to connect for a study session on Data Structures.',
        time: new Date(),
        read: false,
        action: {
          text: 'Accept',
          url: '/messages',
          data: {
            subject: 'Data Structures',
            buddy: {
              id: 101,
              name: 'Emma Thompson',
              subjects: ['Data Structures', 'Algorithms'],
              studyStyle: 'Visual learner'
            }
          }
        }
      },
      {
        id: '2',
        type: 'message',
        title: 'New Message',
        content: 'Alex Johnson sent you a message about your upcoming Physics study session.',
        time: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        read: false,
        action: {
          text: 'Reply',
          url: '/messages',
          data: {
            subject: 'Physics',
            buddy: {
              id: 102,
              name: 'Alex Johnson',
              subjects: ['Physics', 'Mathematics'],
              studyStyle: 'Interactive discussions'
            }
          }
        }
      },
      {
        id: '3',
        type: 'reminder',
        title: 'Study Session Reminder',
        content: 'Your scheduled Machine Learning study session starts in 10 minutes.',
        time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: true,
        action: {
          text: 'Join',
          url: '/scheduling',
          data: {
            subject: 'Machine Learning',
            date: new Date().toLocaleDateString(),
            time: new Date(Date.now() + 10 * 60 * 1000).toLocaleTimeString(),
            duration: '1 hour',
            buddies: ['Michael Lee']
          }
        }
      }
    ];

    setNotifications(demoNotifications);
    setUnreadCount(demoNotifications.filter(n => !n.read).length);

    // Simulate receiving a new notification after 20 seconds
    const timer = setTimeout(() => {
      const newNotification: Notification = {
        id: '4',
        type: 'connection',
        title: 'Study Session Invitation',
        content: 'Sarah Parker invites you to join a Web Development study session now.',
        time: new Date(),
        read: false,
        action: {
          text: 'Join Now',
          url: '/messages',
          data: {
            subject: 'Web Development',
            buddy: {
              id: 103,
              name: 'Sarah Parker',
              subjects: ['Web Development', 'UI/UX Design'],
              studyStyle: 'Project-based learning'
            }
          }
        }
      };

      setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
      setUnreadCount(prevCount => prevCount + 1);
      
      toast.info("New study invitation received", {
        description: "Sarah Parker invites you to study Web Development",
        action: {
          label: "View",
          onClick: () => {
            setOpen(true);
          }
        }
      });
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(prevNotifications => 
      prevNotifications.map(n => 
        n.id === notification.id ? { ...n, read: true } : n
      )
    );
    
    // Update unread count
    setUnreadCount(prevCount => (notification.read ? prevCount : prevCount - 1));
    
    // Handle action
    if (notification.action) {
      setOpen(false);
      
      // Handle special actions
      if (notification.type === 'connection' || (notification.action.data && notification.action.url === '/messages')) {
        navigate('/messages', { state: notification.action.data });
      } else if (notification.type === 'reminder' && notification.action.text === 'Join' && onJoinMeeting) {
        onJoinMeeting(notification.action.data);
      } else {
        navigate(notification.action.url);
      }
    }
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(n => ({ ...n, read: true }))
    );
    setUnreadCount(0);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-300" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-neon-pink text-white text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 glass-card">
        <div className="flex justify-between items-center p-3 border-b border-white/10">
          <h3 className="font-medium text-white">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-neon-cyan hover:text-neon-cyan/80"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        <div className="max-h-80 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <div 
                key={notification.id}
                className={`p-3 border-b border-white/10 cursor-pointer hover:bg-white/5 ${!notification.read ? 'bg-white/10' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className={`font-medium ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                      {notification.title}
                    </h4>
                    <p className="text-sm text-gray-400 mt-1">{notification.content}</p>
                  </div>
                  {!notification.read && (
                    <div className="h-2 w-2 rounded-full bg-neon-cyan mt-1"></div>
                  )}
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    {notification.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {notification.action && (
                    <Button size="sm" variant="outline" className="h-7 text-xs border-neon-purple text-neon-purple hover:bg-neon-purple/10">
                      {notification.action.text}
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-400">No notifications yet</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationSystem;
