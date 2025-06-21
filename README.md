🧠 Virtual Memory Manager (VMM) with Paging & TLB Visualizer
A web-based visual simulator that demonstrates how operating systems handle virtual memory translation using **paging**, **page tables**, and **Translation Lookaside Buffers (TLBs)**. 
The system supports   multiple page replacement algorithms and provides analytics on TLB hits, page faults, and performance.  

to view the project click the link below 👇👇🧑🏻‍💻🧑🏻‍💻  
https://sumitkarki188.github.io/React-VirtualMemoryManagement/  
                      or  
https://encr.pw/Virtual-Memory-Management  
  
## 📌 Features  

- Simulates:
  - Virtual address translation
  - Page Table & TLB lookup
  - Page faults & replacements
- Implements multiple **Page Replacement Algorithms**:
  - FIFO (First-In-First-Out)
  - LRU (Least Recently Used)
  - Optimal
  - MRU (Most Recently Used)
- Visual representation of:
  - TLB
  - Page Table
  - Physical Memory frames
- Collects & displays:
  - TLB hit/miss rates
  - Page fault rates
  - Execution performance metrics
-Downloading the Metrics
  -memory usage chart
  -memory performance chart
  -metrics usage

## 💻 Technologies Used

| Tool/Tech        | Description                       |
|------------------|------------------------------------|
| Language         | C/C++ & JS (Backend logic)        |
| Frontend         | React + Vite                      |
| Backend          | Logic simulated in-browser        |
| Deployment       | GitHub Pages                      |
| Platform         | Cross-platform (Linux/Windows)    |



## 🧭 Working Steps (Simplified Flow)

1. **Define Constants and Structures**
   - Page Table: 256 entries
   - TLB: 16-entry circular buffer
   - Physical Memory: `char memory[NUM_FRAMES][FRAME_SIZE]`

2. **Read Virtual Address**
   - From `addresses.txt`
   - Extract page number & offset

3. **TLB Lookup**
   - If hit → get frame
   - If miss → go to page table

4. **Page Table Lookup**
   - If found → get frame
   - If not → page fault

5. **Page Fault Handling**
   - Use page replacement (FIFO/LRU/Optimal/MRU)
   - Load page from `BACKING_STORE.bin`

6. **Update TLB**
   - Add page-frame entry (FIFO/LRU logic)

7. **Translate to Physical Address**
   - `physical_address = frame * PAGE_SIZE + offset`

8. **Log Output & Performance**
   - Total addresses
   - Page Faults & Rate
   - TLB Hits & Rate

## 📈 Example Output

Total Addresses Processed: 1000
Page Faults: 135
Page Fault Rate: 13.5%
TLB Hits: 250
TLB Hit Rate: 25.0%



## 🛠 How to Run Locally

### 1. Clone the Repo
```bash
git clone https://github.com/sumitkarki188/React-VirtualMemoryManagement.git
cd React-VirtualMemoryManagement

2. Install Dependencies
npm install
3. Run Dev Server
npm run dev
