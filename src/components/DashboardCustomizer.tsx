
import React, { useState } from 'react';
import { Settings, Eye, EyeOff, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DashboardWidget {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  order: number;
}

interface DashboardCustomizerProps {
  widgets: DashboardWidget[];
  onUpdateWidgets: (widgets: DashboardWidget[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const DashboardCustomizer: React.FC<DashboardCustomizerProps> = ({
  widgets,
  onUpdateWidgets,
  isOpen,
  onClose
}) => {
  const [localWidgets, setLocalWidgets] = useState(widgets);

  if (!isOpen) return null;

  const handleToggleWidget = (id: string) => {
    setLocalWidgets(prev => 
      prev.map(widget => 
        widget.id === id ? { ...widget, enabled: !widget.enabled } : widget
      )
    );
  };

  const handleSave = () => {
    onUpdateWidgets(localWidgets);
    onClose();
  };

  const moveWidget = (index: number, direction: 'up' | 'down') => {
    const newWidgets = [...localWidgets];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newWidgets.length) {
      [newWidgets[index], newWidgets[targetIndex]] = [newWidgets[targetIndex], newWidgets[index]];
      setLocalWidgets(newWidgets);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg w-full max-w-2xl animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Customize Dashboard</h2>
          </div>
          <Button variant="ghost" onClick={onClose}>×</Button>
        </div>

        <div className="p-6">
          <p className="text-muted-foreground mb-4">
            Choose which widgets to display and arrange their order on your dashboard.
          </p>

          <div className="space-y-3">
            {localWidgets.map((widget, index) => (
              <div
                key={widget.id}
                className={`flex items-center justify-between p-4 border rounded-lg transition-all ${
                  widget.enabled ? 'border-primary/20 bg-primary/5' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveWidget(index, 'up')}
                      disabled={index === 0}
                      className="h-4 w-4 p-0"
                    >
                      ▲
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveWidget(index, 'down')}
                      disabled={index === localWidgets.length - 1}
                      className="h-4 w-4 p-0"
                    >
                      ▼
                    </Button>
                  </div>
                  
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  
                  <div>
                    <h3 className="font-medium">{widget.name}</h3>
                    <p className="text-sm text-muted-foreground">{widget.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge variant={widget.enabled ? "default" : "outline"}>
                    {widget.enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleWidget(widget.id)}
                  >
                    {widget.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
