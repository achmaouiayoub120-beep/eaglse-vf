package repository;

import java.util.List;

/**
 * Generic Repository interface for CRUD operations.
 */
public interface Repository<T> {
    void save(T entity);
    T getById(String id);
    List<T> getAll();
    void update(T entity);
    void delete(String id);
    void saveAll(List<T> entities);
}
