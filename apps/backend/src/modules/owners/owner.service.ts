import { ownerRepository } from './owner.repository.js';
import { AppError } from '../../core/errors/app-error.js';
import { ErrorCodes } from '../../core/errors/error-codes.js';
import { getPaginationMeta, getSkipTake } from '../../core/utils/pagination.js';

class OwnerService {
  async getAllOwners() {
    return ownerRepository.findAll();
  }

  async getOwnerById(id: string) {
    const owner = await ownerRepository.findById(id);
    if (!owner) {
      throw AppError.notFound(ErrorCodes.OWNER_NOT_FOUND, 'Owner not found');
    }
    return owner;
  }

  async getProductsByOwner(ownerId: string, page: number, limit: number) {
    const owner = await ownerRepository.findById(ownerId);
    if (!owner) {
      throw AppError.notFound(ErrorCodes.OWNER_NOT_FOUND, 'Owner not found');
    }

    const { skip, take } = getSkipTake(page, limit);
    const { products, total } = await ownerRepository.getProductsByOwner(ownerId, skip, take);
    const meta = getPaginationMeta(total, page, limit);

    return { products, meta };
  }
}

export const ownerService = new OwnerService();
