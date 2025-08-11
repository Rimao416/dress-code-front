import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sliders = await prisma.slider.findMany({
      where: {
        isActive: true,
        OR: [
          { startDate: null },
          { startDate: { lte: new Date() } }
        ],
        AND: [
          {
            OR: [
              { endDate: null },
              { endDate: { gte: new Date() } }
            ]
          }
        ]
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json({
      success: true,
      data: sliders
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' // 5min cache, 10min SWR
      }
    });
  } catch (error) {
    console.error('Error fetching sliders:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch sliders'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
