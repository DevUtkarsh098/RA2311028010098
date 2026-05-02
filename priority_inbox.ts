export type NotificationType = 'Event' | 'Result' | 'Placement';

export interface Notification {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string; // e.g. "2026-04-22 17:51:30"
}

/**
 * Helper to determine priority weight.
 * Placement (3) > Result (2) > Event (1).
 */
function getWeight(type: NotificationType): number {
  switch (type) {
    case 'Placement': return 3;
    case 'Result': return 2;
    case 'Event': return 1;
    default: return 0;
  }
}

/**
 * Returns a positive number if a has HIGHER priority than b.
 * Priority: Higher Weight, then Newer Timestamp.
 */
function comparePriority(a: Notification, b: Notification): number {
  const weightA = getWeight(a.Type);
  const weightB = getWeight(b.Type);

  if (weightA !== weightB) {
    return weightA - weightB;
  }
  
  // If weights are equal, newer timestamp wins.
  // Since timestamps are in YYYY-MM-DD HH:mm:ss format, string comparison works.
  if (a.Timestamp > b.Timestamp) return 1;
  if (a.Timestamp < b.Timestamp) return -1;
  return 0;
}

/**
 * PriorityInbox maintains the top 'n' most important notifications efficiently.
 * It uses a Min-Heap approach where the "smallest" element in the heap 
 * represents the least important notification currently in the top 'n'.
 */
export class PriorityInbox {
  private heap: Notification[] = [];
  private limit: number;

  constructor(limit: number = 10) {
    this.limit = limit;
  }

  private parent(i: number): number { return Math.floor((i - 1) / 2); }
  private left(i: number): number { return 2 * i + 1; }
  private right(i: number): number { return 2 * i + 2; }

  private swap(i: number, j: number): void {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }

  // Heapifies down starting from index i. 
  // It ensures the smallest (least important) element is at the root.
  private heapify(i: number): void {
    let smallest = i;
    const l = this.left(i);
    const r = this.right(i);
    const n = this.heap.length;

    // We want the LEAST important element at the root of our min-heap.
    // comparePriority(a, b) > 0 means 'a' is MORE important than 'b'.
    // So 'a' < 'b' in min-heap terms if comparePriority(a, b) < 0.
    if (l < n && comparePriority(this.heap[l], this.heap[smallest]) < 0) {
      smallest = l;
    }
    if (r < n && comparePriority(this.heap[r], this.heap[smallest]) < 0) {
      smallest = r;
    }

    if (smallest !== i) {
      this.swap(i, smallest);
      this.heapify(smallest);
    }
  }

  /**
   * Adds a new notification to the priority inbox.
   * Runs in O(log n) time.
   */
  public addNotification(notification: Notification): void {
    if (this.heap.length < this.limit) {
      // If heap is not full, add at the end and bubble up
      this.heap.push(notification);
      let i = this.heap.length - 1;
      while (i !== 0 && comparePriority(this.heap[this.parent(i)], this.heap[i]) > 0) {
        this.swap(i, this.parent(i));
        i = this.parent(i);
      }
    } else {
      // If heap is full, compare with the root (the least important in the top n)
      // If the new notification is MORE important than the root, replace root and heapify down.
      if (comparePriority(notification, this.heap[0]) > 0) {
        this.heap[0] = notification;
        this.heapify(0);
      }
    }
  }

  /**
   * Returns the top 'n' notifications sorted from most important to least important.
   */
  public getTopNotifications(): Notification[] {
    // Return a sorted copy of the heap.
    // Since comparePriority > 0 means more important, we sort descending.
    return [...this.heap].sort((a, b) => comparePriority(b, a));
  }
}

// Example usage to verify functionality:
if (require.main === module) {
  const inbox = new PriorityInbox(3);
  inbox.addNotification({ ID: '1', Type: 'Event', Message: 'Event 1', Timestamp: '2026-04-22 10:00:00' });
  inbox.addNotification({ ID: '2', Type: 'Result', Message: 'Result 1', Timestamp: '2026-04-22 10:05:00' });
  inbox.addNotification({ ID: '3', Type: 'Placement', Message: 'Placement 1', Timestamp: '2026-04-22 09:00:00' });
  inbox.addNotification({ ID: '4', Type: 'Event', Message: 'Event 2', Timestamp: '2026-04-22 11:00:00' });
  inbox.addNotification({ ID: '5', Type: 'Result', Message: 'Result 2', Timestamp: '2026-04-22 10:10:00' });
  
  console.log('Top 3 notifications:');
  console.log(inbox.getTopNotifications());
}
