import { Controller, Get, Post, Body, Param, Put, Delete, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueConstraintFilter } from '@src/common/filters/unique-constraint.filter';
import {
    ApiRaffleEntryFindAll,
    ApiRaffleEntryFindOne,
    ApiRaffleEntryCreate,
    ApiRaffleEntryUpdate,
    ApiRaffleEntryDelete,
} from '@src/common/decorators/api-raffle-entry.decorator';

// Data Transfer Objects
import { CreateRaffleEntryDto } from './dto/create-raffle-entry.dto';
import { RaffleEntryResponseDto } from './dto/raffle-entry-response.dto';

// Service
import { RaffleEntryService } from './raffle-entry.service';

@ApiTags('raffle-entry')
@Controller('raffle-entry')
@UseFilters(UniqueConstraintFilter)
export class RaffleEntryController {
    constructor(private readonly raffleEntryService: RaffleEntryService) { }

    /**
     * Get all raffle entries
     *
     * @returns {Promise<RaffleEntryResponseDto[]>} Array of raffle entries
     */
    @Get()
    @ApiRaffleEntryFindAll()
    findAll(): Promise<RaffleEntryResponseDto[]> {
        return this.raffleEntryService.findAll();
    }

    /**
     * Get a raffle entry by ID
     *
     * @param {string} id - The raffle entry ID
     *
     * @returns {Promise<RaffleEntryResponseDto | null>} The raffle entry or null if not found
     */
    @Get(':id')
    @ApiRaffleEntryFindOne()
    findOne(@Param('id') id: string): Promise<RaffleEntryResponseDto | null> {
        return this.raffleEntryService.findOne(+id);
    }

    /**
     * Create a new raffle entry
     *
     * @param {CreateRaffleEntryDto} dto - The create raffle entry data transfer object
     *
     * @returns {Promise<RaffleEntryResponseDto>} The created raffle entry
     */
    @Post()
    @ApiRaffleEntryCreate()
    create(@Body() dto: CreateRaffleEntryDto): Promise<RaffleEntryResponseDto> {
        return this.raffleEntryService.create(dto);
    }

    /**
     * Update a raffle entry
     *
     * @param {string} id - The raffle entry ID
     * @param {CreateRaffleEntryDto} dto - The update raffle entry data transfer object
     *
     * @returns {Promise<RaffleEntryResponseDto | null>} The updated raffle entry or null if not found
     */
    @Put(':id')
    @ApiRaffleEntryUpdate()
    update(
        @Param('id') id: string,
        @Body() dto: CreateRaffleEntryDto,
    ): Promise<RaffleEntryResponseDto | null> {
        return this.raffleEntryService.update(+id, dto);
    }

    /**
     * Delete a raffle entry
     *
     * @param {string} id - The raffle entry ID
     *
     * @returns {Promise<{ success: boolean }>} Success status
     */
    @Delete(':id')
    @ApiRaffleEntryDelete()
    async delete(@Param('id') id: string): Promise<{ success: boolean }> {
        const success = await this.raffleEntryService.delete(+id);

        return { success };
    }
}
