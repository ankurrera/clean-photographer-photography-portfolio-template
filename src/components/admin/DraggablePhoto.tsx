import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { GripVertical, Maximize2, ZoomIn, ZoomOut, MoveUp, MoveDown, Trash2 } from 'lucide-react';
import { PhotoLayoutData } from '@/types/wysiwyg';
import { Button } from '@/components/ui/button';

interface DraggablePhotoProps {
  photo: PhotoLayoutData;
  isEditMode: boolean;
  snapToGrid: boolean;
  gridSize: number;
  onUpdate: (id: string, updates: Partial<PhotoLayoutData>) => void;
  onDelete: (id: string) => void;
  onBringForward: (id: string) => void;
  onSendBackward: (id: string) => void;
}

export default function DraggablePhoto({
  photo,
  isEditMode,
  snapToGrid,
  gridSize,
  onUpdate,
  onDelete,
  onBringForward,
  onSendBackward,
}: DraggablePhotoProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0, photoX: 0, photoY: 0 });
  const resizeStartPos = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const snapValue = (value: number) => {
    if (!snapToGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditMode || e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      photoX: photo.position_x,
      photoY: photo.position_y,
    };
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    resizeStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      width: photo.width,
      height: photo.height,
    };
  };

  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStartPos.current.x;
        const deltaY = e.clientY - dragStartPos.current.y;
        
        const newX = snapValue(dragStartPos.current.photoX + deltaX);
        const newY = snapValue(dragStartPos.current.photoY + deltaY);
        
        onUpdate(photo.id, {
          position_x: newX,
          position_y: newY,
        });
      }

      if (isResizing) {
        const deltaX = e.clientX - resizeStartPos.current.x;
        const deltaY = e.clientY - resizeStartPos.current.y;
        
        const aspectRatio = resizeStartPos.current.width / resizeStartPos.current.height;
        const newWidth = Math.max(100, resizeStartPos.current.width + deltaX);
        const newHeight = newWidth / aspectRatio;
        
        onUpdate(photo.id, {
          width: newWidth,
          height: newHeight,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, photo.id, snapToGrid, gridSize, onUpdate]);

  return (
    <motion.div
      className="absolute select-none"
      style={{
        left: photo.position_x,
        top: photo.position_y,
        width: photo.width,
        height: photo.height,
        transform: `scale(${photo.scale}) rotate(${photo.rotation}deg)`,
        zIndex: photo.z_index,
        cursor: isEditMode ? (isDragging ? 'grabbing' : 'grab') : 'default',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        scale: isDragging || isResizing ? 1.02 : 1,
      }}
      transition={{ duration: 0.1 }}
    >
      {/* Photo Image */}
      <img
        src={photo.image_url}
        alt={photo.title || 'Photo'}
        className="w-full h-full object-cover rounded-sm shadow-lg"
        draggable={false}
        onMouseDown={handleMouseDown}
      />

      {/* Edit Mode Overlay */}
      {isEditMode && isHovered && (
        <div className="absolute inset-0 border-2 border-primary rounded-sm pointer-events-none">
          {/* Position Indicator */}
          <div className="absolute -top-8 left-0 bg-primary text-primary-foreground px-2 py-1 text-xs rounded-sm">
            {Math.round(photo.position_x)}, {Math.round(photo.position_y)}
          </div>
          
          {/* Size Indicator */}
          <div className="absolute -bottom-8 left-0 bg-primary text-primary-foreground px-2 py-1 text-xs rounded-sm">
            {Math.round(photo.width)} × {Math.round(photo.height)}
          </div>
        </div>
      )}

      {/* Controls */}
      {isEditMode && isHovered && (
        <div className="absolute -top-10 -right-2 flex gap-1 pointer-events-auto">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 shadow-md"
            onClick={() => onBringForward(photo.id)}
            title="Bring forward"
          >
            <MoveUp className="h-3 w-3" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 shadow-md"
            onClick={() => onSendBackward(photo.id)}
            title="Send backward"
          >
            <MoveDown className="h-3 w-3" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            className="h-8 w-8 shadow-md"
            onClick={() => onDelete(photo.id)}
            title="Delete photo"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Resize Handle */}
      {isEditMode && isHovered && (
        <div
          className="absolute -bottom-2 -right-2 w-6 h-6 bg-primary rounded-full cursor-nwse-resize shadow-md flex items-center justify-center pointer-events-auto"
          onMouseDown={handleResizeStart}
          title="Resize"
        >
          <Maximize2 className="h-3 w-3 text-primary-foreground" />
        </div>
      )}

      {/* Drag Handle */}
      {isEditMode && isHovered && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary/80 rounded-full cursor-grab shadow-md flex items-center justify-center pointer-events-auto"
          onMouseDown={handleMouseDown}
          title="Drag to move"
        >
          <GripVertical className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
    </motion.div>
  );
}
