import { NextRequest, NextResponse } from 'next/server';
import { loadHospitalState } from '@/lib/store';

// GET /api/doctors
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get('departmentId');

    const state = loadHospitalState();
    let doctors = state.doctors;

    if (departmentId) {
      doctors = doctors.filter(d => d.departmentId === departmentId);
    }

    // Enhance doctors with active queue count and current ticket details
    const doctorsWithStats = doctors.map(doc => {
      const activeTickets = state.tickets.filter(
        t => t.doctorId === doc.id && (t.status === 'WAITING' || t.status === 'CALLED')
      );
      const currentTicket = doc.currentTicketId 
        ? state.tickets.find(t => t.id === doc.currentTicketId) 
        : null;
      const department = state.departments.find(d => d.id === doc.departmentId);

      return {
        ...doc,
        departmentName: department?.name || 'General',
        waitingCount: activeTickets.length,
        currentTicket: currentTicket || null
      };
    });

    return NextResponse.json({
      success: true,
      count: doctorsWithStats.length,
      data: doctorsWithStats
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}
